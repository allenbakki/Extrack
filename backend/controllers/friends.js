import { auth, verifyToken } from "../auth/firebaseAuth.js";
import { db } from "../auth/db.js";

export async function deleteFriendRequest(req, res) {
  const token = req.headers.authorization;
  console.log(token);

  const { email } = req.body;
  console.log(email);
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const response = await auth.getUserByEmail(email);
    if (!response.uid) {
      return res.json({ message: "not a user" });
    }

    const friendId = response.uid;
    const friendRef = ref.doc(friendId);
    const userRef = ref.doc(decodedToken.userId);

    const friendDoc = await friendRef.get();
    const userDoc = await userRef.get();
    const userDocData = userDoc.data();
    const friendDocData = friendDoc.data();
    const receivedReqByUser = userDocData.receivedReq || [];
    const sentReqByFriend = friendDocData.sentReq || [];
    const userFriends = userDocData.friends || [];
    const friendsFriends = friendDocData.friends || [];

    const receivedFriendReqIndex = receivedReqByUser.indexOf(friendId);
    const sentFriendReqIndex = sentReqByFriend.indexOf(decodedToken.uid);
    receivedReqByUser.splice(receivedFriendReqIndex, 1);
    sentReqByFriend.splice(sentFriendReqIndex, 1);

    await userRef.set(
      {
        receivedReq: receivedReqByUser,
      },
      { merge: true }
    );

    await friendRef.set(
      {
        sentReq: sentReqByFriend,
      },
      { merge: true }
    );
    res.status(200).json({ message: "Friend request deleted", status: 200 });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteFriend(req, res) {
  const token = req.headers.authorization;
  console.log(token);

  const { email } = req.body;
  console.log(email);
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const response = await auth.getUserByEmail(email);
    if (!response.uid) {
      return res.json({ message: "not a user" });
    }

    const friendId = response.uid;
    const friendRef = ref.doc(friendId);
    const userRef = ref.doc(decodedToken.userId);

    const friendDoc = await friendRef.get();
    const userDoc = await userRef.get();
    const userDocData = userDoc.data();
    const friendDocData = friendDoc.data();
    // const receivedReqByUser = userDocData.friends || [];
    // const sentReqByFriend = friendDocData.sentReq || [];
    const userFriends = userDocData.friends || [];
    const friendsFriends = friendDocData.friends || [];

    const userFriend = userFriends.indexOf(friendId);
    const friendOfUser = friendsFriends.indexOf(decodedToken.uid);
    userFriends.splice(userFriend, 1);
    friendsFriends.splice(friendOfUser, 1);

    await userRef.set(
      {
        friends: userFriends,
      },
      { merge: true }
    );

    await friendRef.set(
      {
        friends: friendsFriends,
      },
      { merge: true }
    );
    res.status(200).json({ message: "Friend request deleted", status: 200 });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addFriendRequest(req, res) {
  const token = req.headers.authorization;
  console.log(token);

  const { email } = req.body;
  console.log(email);
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const response = await auth.getUserByEmail(email);
    console.log(response);
    if (!response) {
      return res.status(400).json({ message: "not a user" });
    }

    const friendId = response.uid;
    console.log(friendId);
    const friendRef = ref.doc(friendId);
    const userRef = ref.doc(decodedToken.userId);

    const friendDoc = await friendRef.get();
    const userDoc = await userRef.get();
    const userDocData = userDoc.data();
    const friendDocData = friendDoc.data();
    const receivedReqByUser = userDocData.receivedReq || [];
    const sentReqByFriend = friendDocData.sentReq || [];
    const userFriends = userDocData.friends || [];
    const friendsFriends = friendDocData.friends || [];
    console.log("friendsFriends", friendsFriends);

    const receivedFriendReqIndex = receivedReqByUser.indexOf(friendId);
    const sentFriendReqIndex = sentReqByFriend.indexOf(decodedToken.userId);
    receivedReqByUser.splice(receivedFriendReqIndex, 1);
    sentReqByFriend.splice(sentFriendReqIndex, 1);
    console.log(receivedReqByUser);
    console.log(sentReqByFriend);
    await userRef.set(
      {
        receivedReq: receivedReqByUser,
        friends: [...userFriends, friendId],
      },
      { merge: true }
    );

    await friendRef.set(
      {
        sentReq: sentReqByFriend,
        friends: [...friendsFriends, decodedToken.userId],
      },
      { merge: true }
    );
    res.status(200).json({ message: "Friend added", status: 200 });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    } else if (error.code === "auth/invalid-email") {
      console.error("Invalid email format:", error.message);
      res.json({ error: "Not a user !!" });
    } else {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export async function sendFriendRequest(req, res) {
  const token = req.headers.authorization;
  console.log(token);

  const { email } = req.body;
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }

    const response = await auth.getUserByEmail(email);
    console.log(response);
    if (!response) {
      return res.status(400).json({ message: "not a user" });
    }
    const { displayName, uid } = response;

    const friendId = uid;
    const friendRef = ref.doc(friendId);
    const userRef = ref.doc(decodedToken.userId);

    const friendDoc = await friendRef.get();
    const userDoc = await userRef.get();

    if (!friendDoc.exists || !friendId) {
      return res.json({ message: "Friend doesn't exist" });
    }

    if (!userDoc.exists) {
      return res.json({ message: "User doesn't exist" });
    }

    const userDocData = userDoc.data();
    const friendDocData = friendDoc.data();
    const sentReqByUser = userDocData.sentReq || [];
    const receivedReqByFriend = friendDocData.receivedReq || [];

    await userRef.set(
      {
        sentReq: [...sentReqByUser, friendId],
      },
      { merge: true }
    );

    await friendRef.set(
      {
        receivedReq: [...receivedReqByFriend, decodedToken.userId],
      },
      { merge: true }
    );
    res.json({ message: "Sent friend request", data: { email, displayName } });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    } else if (error.code === "auth/invalid-email") {
      console.error("Invalid email format:", error.message);
      res.json({ error: error.message });
    } else if (error.code === "auth/user-not-found") {
      console.error("Invalid email format:", error.message);
      res.json({ error: "Not a user !!" });
    } else {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export async function getFriends(req, res) {
  const token = req.headers.authorization;
  console.log(token);
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log(decodedToken);
    const userRef = ref.doc(decodedToken.userId);
    const userDoc = await userRef.get();

    const userData = userDoc.data();
    console.log(userData);
    const userFriends = userData.friends || [];

    if (!userFriends && userFriends != []) {
      return res.json({ message: "No friends found" });
    }

    const transformFriendsIds = userFriends.map((id) => {
      return { uid: id };
    });
    console.log(userFriends, transformFriendsIds);

    const userRecords = await auth.getUsers(transformFriendsIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    });

    res.status(200).json(filteredUserRecords);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendSentReq(req, res) {
  const { token } = req.body;
  const ref = db.collection(`users`);
  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403).json({ message: "token expired" });
    }

    console.log(decodedToken);
    const userRef = ref.doc(decodedToken.uid);
    const userDoc = await userRef.get();

    const userData = userDoc.data();
    const userFriendsSentReq = userData.sentReq || [];

    if (!userFriendsSentReq) {
      return res.json({ message: "No friends request found" });
    }

    const transformFriendsIds = userFriendsSentReq.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformFriendsIds);
    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    });

    res.status(200).json(filteredUserRecords);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendReceivedReq(req, res) {
  const token = req.headers.authorization;
  const ref = db.collection(`users`);

  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken.userId) {
      return res.status(403);
    }
    const userRef = ref.doc(decodedToken.userId);
    const userDoc = await userRef.get();

    const userData = userDoc.data();
    const userFriendsReceivedReq = userData.receivedReq || [];
    console.log(userFriendsReceivedReq, "userFriendsReceivedReq");

    if (!userFriendsReceivedReq) {
      return res.json({ message: "No friends request received" });
    }

    const transformFriendsIds = userFriendsReceivedReq.map((id) => {
      return { uid: id };
    });

    const userRecords = await auth.getUsers(transformFriendsIds);
    console.log(userRecords);

    const filteredUserRecords = userRecords.users.map((user) => {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    });
    console.log(filteredUserRecords);
    res.status(200).json(filteredUserRecords);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "JWT has expired" });
    }
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



