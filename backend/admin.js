import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";
import * as dotenv from "dotenv";
dotenv.config();
import { key } from "./service";

admin.initializeApp({
  credential: admin.credential.cert(key),
});

export const getUsers = async () => {
  const users = [];
  getAuth()
    .listUsers(1000, "/")
    .then((listUsersResult) => {
      listUsersResult.users
        .filter((user) => user.displayName !== "Admin")
        .forEach((user) => {
          users.push({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          });
        });
      addFoodData(users);
    });
};

const day = new Date();

let dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(day.getDate() + 6).padStart(2, "0")}`;
console.log(dateString);

export const addFoodData = async (users) => {
  const foodData = {
    morning: true,
    noon: true,
    night: true,
  };

  users.forEach(async (user) => {
    const result = await admin
      .firestore()
      .collection(dateString)
      .doc(user?.uid)
      .set({
        createdAt: Timestamp.now(),
        day: dateString,
        email: user?.email,
        name: user?.name,
        foodData,
      })
      .then(() => {
        console.log("Successfully added");
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

// export const getDate = async () => {
//   const userList = [];
//   admin
//     .firestore()
//     .collection("users")
//     .get()
//     .then((snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         [doc.data()]
//           .filter((doc) => doc.displayName !== undefined)
//           .forEach((name) => {
//             userList.push(name);
//           });
//       });
//     });
// };
