# react-native-phone-auth-component
A simple, elegant component that integrates with a phone authentication setup, styling and transitions included
![Gif](https://media.giphy.com/media/3o751VB4V9nTENQAEg/giphy.gif)
# Installation
```npm i --save react-native-phone-auth-component```
# Usage
### Default Props
```javascript
import PhoneAuth from 'react-native-phone-auth-component';
...
<PhoneAuth
  signInWithPhone={phone => console.log('Please attach method to signInWithPhone prop')}
  redeemCode={code => console.log('Please attach method to redeemCode prop')}
  codeLength={4}
  buttonTextColor='black'
  spinnerColor='black'
  color='#ff8203'
  androidFont='monospace'
  iOSFont='Menlo'
  containerStyle={{flex: 1}}
  verifyButtonMessage='Verify Phone Number*'
  disclaimerMessage='*Message & data rates may apply.'
  cca2='US'
  callingCode={1}
/>
```
### Props
| Prop Name  | Data Type | Required? | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| signInWithPhone  | Function  | **Yes** | console.log | Event handler when user enters phone number. Phone number as a String as first argument. Must return a Promise to proceed |
| redeemCode  | Function  | **Yes** | console.log | Event handler when user enters code. Code as a Number as first argument. Must return a Promise to proceed |
| color  | String  | No | '#ff8203' | Color of text underline and buttons |
| buttonTextColor  | String  | No | 'white' | Color of button text |
| spinnerColor  | String  | No | 'white' | Color of the spinner when loading |
| androidFont  | String  | No | 'monospace' | Android font type |
| iOSFont  | String  | No | 'Menlo' | iOS font type |
| containerStyle  | Object  | No | {flex: 1} | Style of the container of the component |
| verifyButtonMessage  | String  | No | 'Verify Phone Number*' | The message on the first button |
| disclaimerMessage  | String  | No | 'Message & data rates may apply.' | The disclaimer message |
| enterCodeMessage  | String  | No | 'Enter Code' | The message on the second button |
| codeLength  | Number  | No | 4 | The length of the code the user will enter |
| cca2	| String | No | 'US' | The default country code |
| callingCode | Number | No | 1 | The default calling code accompanied by cca2 |
### Returning a Promise
In order for the component to know when you go to the server and send off the text message, you must return a promise in your helper method. Here's an example to illustrate how this would happen

# Example
```javascript
class PhoneVerifyScreen extends React.Component{

  state = {
    phone: '',
    code: ''
  };

  // here is where you connect to your api to redeem a user's code
  // I'm using Firebase in this example but of course you don't have to
  // To avoid confusion, I'm storing the API address in process.env.URL. You don't have to do this
  signInWithPhone(phone){
    this.setState({phone});
    
    return axios.post(process.env.URL + '/signInWithPhone', {
      phone
    }).then((tok) => {
      return Promise.resolve();
    }).catch(e => {
      alert('There was an error or something');
      return Promise.reject();
    });
  }

  redeemCode(code){
    return axios.post(process.env.URL + '/redeemCode', {
      phone: this.state.phone,
      code
    }).then((res) => {
      let tok = res.data.token;
      firebase.auth().signInWithCustomToken(tok).then(() => {
        return Promise.resolve();
      }).catch(e => {
        alert(e.error);
        return Promise.reject();
      });
    }).catch(e => {
      alert(e.response.data.error);
      return Promise.reject();
    });
  }

  render(){
    return(
      <View style={{flex: 1}}>
      {/*           ^^^^^^^^ */}
      {/* Make sure to have flex: 1 on parent! */}
      
        <PhoneAuth
          signInWithPhone={phone => this.signInWithPhone(phone)}
          redeemCode={code => this.redeemCode(code)}
          codeLength={4}
          buttonTextColor={'black'}
          spinnerColor={'black'}
        />
      </View>
    );
  }
}
```
