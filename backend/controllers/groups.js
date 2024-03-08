import { auth, firestore, verifyToken } from "../auth/firebaseAuth.js";
import { db } from "../auth/db.js";
import { replaceIdsWithDisplayNamesString } from "./expenses.js";
export async function createGroup(req, res) {
  const token = req.headers.authorization;
  const { friendIds, groupName } = req.body.createGroupDetails;
  console.log(friendIds);

  try {
    if (!groupName) throw "Required Group name";
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const ref = db.collection("groups");
    const userCollectionRef = db.collection("users");

    const groupId = groupName + decodedToken.userId;
    console.log(groupId);

    const groupRef = ref.doc(groupId);

    const groupMemberIds = [...friendIds, decodedToken.userId];

    await groupRef.set({
      groupName: groupName,
      groupId: groupId,
      members: groupMemberIds,
      createBy: decodedToken.userId,
      createdAt: Date.now(),
    });

    const updatePromises = groupMemberIds.map(async (memberId) => {
      const userRef = userCollectionRef.doc(memberId);
      const userDoc = await userRef.get();
      const userDocData = userDoc.data();
      const groupIds = userDocData.groupIds || [];

      if (!groupIds.includes(groupId)) {
        await userRef.set(
          {
            groupIds: [...groupIds, groupId],
          },
          { merge: true }
        );
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Group created successfully", status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateGroup(req, res) {
  const { groupName, addMembers, removeMembers, token, groupId } = req.body;

  const groupsRef = db.collection("groups");
  const usersCollection = db.collection("users");

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const userRef = usersCollection.doc(decodedToken.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists || !decodedToken.userId) {
      return res.json({ message: "User does not exist" });
    }

    const groupRef = groupsRef.doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return res.json({ message: "Group does not exist" });
    }

    const groupData = groupDoc.data();

    let updatedGroupName = groupName || groupData.groupName;
    let updatedGroupMembers = groupData.members || [];

    if (addMembers && addMembers.length > 0) {
      updatedGroupMembers = [
        ...new Set([...updatedGroupMembers, ...addMembers]),
      ];
    }

    if (removeMembers && removeMembers.length > 0) {
      updatedGroupMembers = updatedGroupMembers.filter(
        (member) => !removeMembers.includes(member)
      );
    }

    await groupRef.set(
      {
        groupName: updatedGroupName,
        members: updatedGroupMembers,
      },
      { merge: true }
    );

    if (addMembers && addMembers.length > 0) {
      for (let i = 0; i < addMembers.length; i++) {
        const memberId = addMembers[i];
        const memberUserRef = usersCollection.doc(memberId);
        const memberUserDoc = await memberUserRef.get();
        const memberUserData = memberUserDoc.data();
        const groupIds = memberUserData.groupIds || [];

        if (!groupIds.includes(groupId)) {
          await memberUserRef.set(
            {
              groupIds: [...groupIds, groupId],
            },
            { merge: true }
          );
        }
      }
    }

    res.json({ message: "Group updated successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error(error);
    res.json({ message: "Server error" });
  }
}

export const getGroups = async (req, res) => {
  const token = req.headers.authorization;
  try {
    const ref = db.collection("users");
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }
    console.log(decodedToken.userId);
    const userRef = ref.doc(decodedToken.userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const groupIds = userData.groupIds || [];
    console.log(groupIds);

    if (groupIds == [] && groupIds.empty()) {
      return res.json({ message: "No groups found" });
    }

    const groupCollectionRef = db.collection("groups");

    const groupDoc = await groupCollectionRef
      .orderBy("createdAt", "desc")
      .get();

    const document = [];
    const documentCreatedBy = [];

    groupIds.map((ele) => {
      groupDoc.forEach((doc) => {
        if (doc.id === ele) {
          const data = doc.data();
          const createdBy = data.createBy || "";
          if (createdBy != "") {
            documentCreatedBy.push(createdBy);
          }
        }
      });
    });
    console.log(documentCreatedBy);

    const transformIds = documentCreatedBy.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        displayName: user.displayName,
      };
    });

    const idDisplayName = filteredUserRecords.reduce((acc, user) => {
      acc[user.uid] = user.displayName;
      return acc;
    }, {});

    groupIds.map((ele) => {
      groupDoc.forEach((doc) => {
        if (doc.id === ele) {
          const data = doc.data();
          const createdBy = data.createBy || "";
          const name = replaceIdsWithDisplayNamesString(
            createdBy,
            idDisplayName
          );

          document.push({
            ...data,
            createdBy: name,
          });
        }
      });
    });

    console.log(document);

    res.json(document);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getUserDetails(user) {
  try {
    const userRecord = await auth.getUser(user);
    const name = userRecord.displayName;
    return name;
  } catch (error) {
    return "";
  }
}

export const getGroupMembers = async (req, res) => {
  const token = req.headers.authorization;
  const groupId = req.body.groupId;

  try {
    const ref = db.collection(`users`);
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    // Check if the user is a member of the group
    const userRef = ref.doc(decodedToken.userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const groupIds = userData.groupIds || []; // Correct typo in variable name
    if (!groupIds.includes(groupId)) {
      return res.json({ message: "Not a group member" });
    }

    // Retrieve group members
    const groupRef = db.collection(`groups`);
    const groupDoc = await groupRef.doc(groupId).get(); // Use await here
    const groupData = groupDoc.data();
    const members = groupData.members || [];

    const transformMemberIds = members.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformMemberIds);
    console.log(userRecords);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    });

    const newArray = filteredUserRecords
      .filter((item) => item.uid === decodedToken.userId) // Filter the item with the specific ID
      .concat(
        filteredUserRecords.filter((item) => item.uid !== decodedToken.userId)
      ); 

    console.log(newArray);
    res.status(200).json(newArray);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }

    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
