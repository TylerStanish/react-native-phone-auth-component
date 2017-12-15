# react-native-phone-auth-component
A simple, elegant component that seamlessly integrates with a phone authentication setup, styling and transitions included

# Usage
### Default Props
```javascript
<PhoneAuth
  signInWithPhone={phone => this.signInWithPhone(phone)}
  redeemCode={code => this.redeemCode(code)}
  codeLength={4}
  buttonTextColor={'black'}
  spinnerColor={'black'}
  color={'#ff8203'}
  androidFont={'monospace'}
  iOSFont={'Menlo'}
  containerStyle={{flex: 1}}
  verifyButtonMessage={'Verify Phone Number*'}
  disclaimerMessage={'*Message & data rates may apply.'}
/>
```

# Example
![Gif](https://media.giphy.com/media/3o6fIUTzWand2sRtwQ/giphy.gif)
```javascript
class PhoneVerifyScreen extends React.Component{

  state = {
    phone: '',
    code: ''
  };

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
        console.log(e);
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
        <StatusBar hidden={false}/>
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