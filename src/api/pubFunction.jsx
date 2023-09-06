import axios from 'axios';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { firebase } from '../config';

const storage = getStorage(firebase);

const myUploadFile = async (file, foldor) => {
  try {
    const storageRef = ref(storage, `/${foldor}/${uuidv4()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    return null;
  }
};

const shareToSocialMedia = async (title, photo, telphone) => {
  try {
    // const messageItem = `شارك في البحث بانك تعمل شير - ${title}
    // Tel: ${telphone}
    // Google Play: https://shorturl.at/ouLQW
    // Apple Store: https://shorturl.at/botX8
    // #مفقود
    // #لا_للحرب`;
    // if (photo === 'Nil') {
    //   facebookText({ post: messageItem });
    // } else {
    //   facebookMedia({ post: messageItem, mediaUrl: photo });
    // }
  } catch (error) {
    console.log(`MyError: ${error}`);
  }
};

const facebookText = async (post) => {
  try {
    await axios.post(`https://graph.facebook.com/${process.env.REACT_APP_FACEBOOKPAGEID}/feed`, {
      message: post,
      access_token: process.env.APP_TOKEN,
    });
  } catch (error) {
    console.log(`MyError: ${error}`);
  }
};

const facebookMedia = async ({ post, mediaUrl }) => {
  try {
    // const { post, mediaUrl } = req.body;
    console.log(post);
    console.log(mediaUrl);
    console.log(process.env.REACT_APP_FACEBOOKPAGEID);
    console.log(process.env.REACT_APP_FACEBOOKPAGETOKEN);

    // console.log(telphone);

    await axios.post(`https://graph.facebook.com/${process.env.REACT_APP_FACEBOOKPAGEID}/photos`, {
      url: mediaUrl,
      message: post,
      access_token: process.env.REACT_APP_FACEBOOKPAGETOKEN,
    });
  } catch (error) {
    console.log(`MyError: ${error}`);
  }
};

export { myUploadFile, shareToSocialMedia, facebookText, facebookMedia };

// const tweetText = 'https://shareto-socialmedia.herokuapp.com/api/tweet/tweetText';
// const facebookText = 'https://shareto-socialmedia.herokuapp.com/api/facebook/facebookText';
// const tweetMedia = 'https://shareto-socialmedia.herokuapp.com/api/tweet/tweetMedia';
// const facebookMedia = 'https://shareto-socialmedia.herokuapp.com/api/facebook/facebookMedia';

// const tweetText = 'http://localhost:4000/api/tweet/tweetText';
// const tweetMedia = 'http://localhost:4000/api/tweet/tweetMedia';
// const facebookText = 'http://localhost:4000/api/facebook/facebookText';
// const facebookMedia = 'http://localhost:4000/api/facebook/facebookMedia';

// await axios.post(facebookText, {
//   post: messageItem,
// });
// await axios.post(facebookMedia, {
//   post: messageItem,
//   mediaUrl: photo,
// });
