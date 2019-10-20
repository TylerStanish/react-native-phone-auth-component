import React from 'react';
import {
  View,
  Dimensions,
  Text,
  Keyboard,
  Animated,
  AppState,
  TextInput,
  Platform
} from 'react-native';
import Button from './Button';
import CountryPicker from 'react-native-country-picker-modal';
import PropTypes from 'prop-types';

const {width} = Dimensions.get('window');


class PhoneVerifyScreen extends React.Component{

  constructor(p){
    super(p);
    this.state = {
      number: '',
      code: '',
      keyboardHeight: 0,
      countryInfo: {
        cca2: p.cca2,
        callingCode: p.callingCode
      },

      verifying: true,
      verifyOpacity: new Animated.Value(0),
      redeemOpacity: new Animated.Value(0),

      appState: '',

      loading: false,
      loadingRedeem: false
    };
    this.styles = {
      phoneAuthText: {
        fontSize: width/10,
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: this.props.color,
        // textDecorationLine: 'underline',
        margin: 10,
        fontFamily: Platform.OS === 'android' ? this.props.androidFont : this.props.iOSFont
      },
      finePrint: {
        fontSize: 12,
        color: 'gray',
        marginHorizontal: 15,
        marginTop: 10
      }
    };
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange(nextAppState){
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this._ref) {
        this._ref.focus();
      }
      if(this._ref2){
        this._ref2.focus();
      }
    }
    this.setState({appState: nextAppState});
  }

  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    let bla = Keyboard.addListener('keyboardDidShow', (e) => {
      this.setState({keyboardHeight: e.endCoordinates.height});
    });
    this._ref.focus();
    Animated.timing(this.state.verifyOpacity, {toValue: 1}).start();
  }

  renderAreaCode(){
    let arr = [];
    let numbers = this.state.number.split('').slice(0, 3);
    for(let i=0; i<3; i++){
      if(isNaN(numbers[i])) numbers[i] = '_';
    }
    // we can use indexOf here because it returns the first index that it encounters '_'
    let next = numbers.indexOf('_');

    arr.push(React.createElement(
      Text,
      { key: Math.random(), style: this.styles.phoneAuthText },
      "("
    ));
    numbers.map((num, index) => {
      let color = 'black';
      if(index === next) color = this.props.color;
      arr.push(React.createElement(
        Text,
        { key: index, style: [this.styles.phoneAuthText, { color }] },
        num
      ));
    });
    arr.push(React.createElement(
      Text,
      { key: Math.random(), style: this.styles.phoneAuthText },
      ")"
    ));
    return arr;
  }

  renderNumber(){
    let arr = [];
    let numbers = this.state.number.split('').slice(0, 10);
    for(let i=0; i<10; i++){
      if(isNaN(numbers[i])) numbers[i] = '_';
    }
    let next = numbers.indexOf('_');
    numbers.slice(3, 6).map((num, index) => {
      let color = 'black';
      if(index+3 === next) color = this.props.color;
      arr.push(React.createElement(
        Text,
        { key: index + 100, style: [this.styles.phoneAuthText, { color }] },
        num
      ));
    });
    arr.push(React.createElement(
      Text,
      { key: Math.random(), style: this.styles.phoneAuthText },
      "-"
    ));
    numbers.slice(6, 10).map((num, index) => {
      let color = 'black';
      if(index+6 === next) color = this.props.color;
      arr.push(React.createElement(
        Text,
        { key: index, style: [this.styles.phoneAuthText, { color }] },
        num
      ));
    });
    return arr;
  }

  renderCode(){
    let arr = [];
    let numbers = this.state.code.split('');
    for(let i=0; i<this.props.codeLength; i++){
      if(isNaN(numbers[i])) numbers[i] = '_';
    }
    let next = numbers.indexOf('_');
    numbers.map((num, index) => {
      let color = 'black';
      if(index === next) color = this.props.color;
      arr.push(React.createElement(
        Text,
        { key: index, style: [this.styles.phoneAuthText, { color, fontSize: width / this.props.codeLength }] },
        num
      ));
    });
    return arr;
  }

  verify(){
    this.setState({loading: true});
    let string = `+${this.state.countryInfo.callingCode}${this.state.number}`;
    this.props.signInWithPhone(string).then(() => {
      Animated.timing(this.state.verifyOpacity, {toValue: 0}).start(() => {
        this.setState({verifying: false}, () => {
          Animated.timing(this.state.redeemOpacity, {toValue: 1}).start();
        });
      });
    }).finally(() => {
      this.setState({loading: false});
    });
  }

  redeemCode(){
    this.setState({loadingRedeem: true});
    this.props.redeemCode(String(this.state.code)).catch(() => {
      this.setState({loadingRedeem: false});
    });
  }


  render(){

    let verifying = (
      <Animated.View style={{
        marginTop: 100,
        flex: 1,
        marginBottom: this.state.keyboardHeight+20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: this.state.verifyOpacity
      }}>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CountryPicker
              cca2={this.state.countryInfo.cca2}
              onChange={e => {
                this._ref.focus();
                this.setState({countryInfo: e});
              }}
              onClose={() => this._ref.focus()}
              filterable
              closeable
              showCallingCode
            />
            <Text style={this.styles.phoneAuthText}>+{this.state.countryInfo.callingCode}</Text>
            {this.renderAreaCode()}
          </View>
          <View style={{flexDirection: 'row'}}>{this.renderNumber()}</View>
        </View>
        <TextInput
          testID='phoneInput'
          ref={ref => this._ref = ref}
          keyboardType={'phone-pad'}
          style={{position: 'absolute', top: -100, left: -100}}
          value={this.state.number}
          onChangeText={num => {
            if(num.length < 11){
              this.setState({number: num});
            }
          }}
        />
        <View style={{alignItems: 'center', width: '100%'}}>
          <Button
            title={this.props.verifyButtonMessage}
            backgroundColor={this.props.color}
            onPress={() => this.verify()}
            loading={this.state.loading}
            spinnerColor={this.props.spinnerColor}
            textColor={this.props.buttonTextColor}
          />
          <Text style={this.styles.finePrint}>{this.props.disclaimerMessage}</Text>
        </View>
      </Animated.View>
    );

    let redeeming = (
      <Animated.View style={{
        opacity: this.state.redeemOpacity,
        marginBottom: this.state.keyboardHeight+20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
      }}>
        <TextInput
          autoFocus
          keyboardType={'phone-pad'}
          style={{position: 'absolute', top: -100, left: -100}}
          value={this.state.code}
          onChangeText={num => {
            if(num.length < this.props.codeLength+1){
              this.setState({code: num});
            }
          }}
          ref={ref => this._ref2 = ref}
        />
        <View/>
        <View style={{flexDirection: 'row'}}>{this.renderCode()}</View>
        <Button
          title={this.props.enterCodeMessage}
          backgroundColor={this.props.color}
          loading={this.state.loadingRedeem}
          onPress={() => this.redeemCode()}
          textColor={this.props.buttonTextColor}
          spinnerColor={this.props.spinnerColor}
        />
      </Animated.View>
    );

    return(
      <View style={this.props.containerStyle}>
        {this.state.verifying ? verifying : redeeming}
      </View>
    );
  }
}

// list of all RN fonts can be found at https://github.com/react-native-training/react-native-fonts
PhoneVerifyScreen.propTypes = {
  color: PropTypes.string,
  buttonTextColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  redeemCode: PropTypes.func.isRequired,
  signInWithPhone: PropTypes.func.isRequired,
  androidFont: PropTypes.string,
  iOSFont: PropTypes.string,
  containerStyle: PropTypes.object,
  verifyButtonMessage: PropTypes.string,
  enterCodeMessage: PropTypes.string,
  disclaimerMessage: PropTypes.string,
  codeLength: PropTypes.number,

  cca2: PropTypes.string,
  callingCode: PropTypes.string
};

PhoneVerifyScreen.defaultProps = {
  color: '#ff8203',
  buttonTextColor: 'white',
  spinnerColor: 'white',
  redeemCode: () => console.log('Please attach method to redeemCode prop'),
  signInWithPhone: () => console.log('Please attach method to signInWithPhone prop'),
  androidFont: 'monospace',
  iOSFont: 'Menlo',
  containerStyle: {flex: 1},
  verifyButtonMessage: 'Verify Phone Number*',
  enterCodeMessage: 'Enter code',
  disclaimerMessage: '*Message & data rates may apply.',
  codeLength: 4,

  cca2: 'US',
  callingCode: '1'
};

export default PhoneVerifyScreen;
