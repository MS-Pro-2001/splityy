// import firestore from '@react-native-firebase/firestore';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// // Configure Google Sign-In
// GoogleSignin.configure({
//   webClientId:
//     '136945013267-m7a1jv9putoo1eqvasu1lfm8ohjjdgp8.apps.googleusercontent.com', // From Firebase console
// });

// export const signInWithGoogle = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const response = await GoogleSignin.signIn();
//     if (isSuccessResponse(response)) {
//       return response.data;
//     } else {
//       // sign in was cancelled by user
//     }
//   } catch (error) {
//     if (isErrorWithCode(error)) {
//       switch (error.code) {
//         case statusCodes.IN_PROGRESS:
//           // operation (eg. sign in) already in progress
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           // Android only, play services not available or outdated
//           break;
//         default:
//         // some other error happened
//       }
//     } else {
//       // an error that's not related to google sign in occurred
//     }
//   }
// };

// // export const signInWithGoogle = async () => {
// //   try {
// //     // Start the sign-in process
// //     // const { idToken } = await GoogleSignin.signIn();
// //     // const googleCredential = auth.GoogleAuthProvider.credential(idToken);

// //     // Sign in the user with Firebase Authentication
// //     // const userCredential = await auth().signInWithCredential(googleCredential);
// //     // const { uid, displayName, email } = userCredential.user;

// //     // Add or update user data in Firestore
// //     // await firestore()
// //     //   .collection('Users')
// //     //   .doc(uid)
// //     //   .set(
// //     //     {
// //     //       name: displayName || 'Unknown User',
// //     //       email: email,
// //     //       createdAt: firestore.FieldValue.serverTimestamp(),
// //     //     },
// //     //     { merge: true } // Merge to avoid overwriting existing data
// //     //   );

// //     console.log('User document created/updated in Firestore!');
// //   } catch (error) {
// //     console.error('Error signing in with Google or updating Firestore:', error);
// //   }
// // };
