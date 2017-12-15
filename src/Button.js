import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Dimensions
} from 'react-native';
const {width} = Dimensions.get('window');

class Button extends React.Component{
  render(){
    return(
      <TouchableOpacity
        style={{
          borderRadius: 5,
          width: width-40,
          height: 60,
          marginHorizontal: 20,
          backgroundColor: this.props.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={0.8}
        onPress={() => this.props.onPress()}
      >
        {this.props.loading ? <ActivityIndicator size={'large'} color={this.props.spinnerColor}/> : <Text style={{fontSize: 20, color: this.props.textColor}}>{this.props.title}</Text>}
      </TouchableOpacity>
    );
  }
}

export default Button;