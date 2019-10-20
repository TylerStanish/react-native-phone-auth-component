import React from 'react';
import {render, fireEvent} from 'react-native-testing-library';
import AuthComponent from '../';
jest.useFakeTimers();
jest.mock('react-native-country-picker-modal', () => 'CountryPickerModal');

const PHONE_NUMBER = '1234567890';


test('should call signInWithPhone prop when button is clicked', () => {
  const mock = jest.fn(() => Promise.resolve());
  const {getByText, getByTestId} = render(<AuthComponent
    signInWithPhone={mock}
    redeemCode={function(){}}
    verifyButtonMessage='clickme'
  />);
  fireEvent.changeText(getByTestId('phoneInput'), PHONE_NUMBER);
  fireEvent.press(getByText('clickme'));
  expect(mock).toBeCalledWith('+1' + PHONE_NUMBER);
});
