import React from 'react';
import {render, fireEvent, waitForElement} from 'react-native-testing-library';
import AuthComponent from '../';
// jest.useFakeTimers();
jest.mock('react-native-country-picker-modal', () => 'CountryPickerModal');

const PHONE_NUMBER = '1234567890';


test('should call signInWithPhone prop when button is clicked', () => {
  const mock = jest.fn(() => Promise.resolve());
  const {getByText, getByTestId} = render(<AuthComponent
    signInWithPhone={mock}
    redeemCode={() => Promise.resolve()}
    verifyButtonMessage='clickme'
  />);
  fireEvent.changeText(getByTestId('phoneInput'), PHONE_NUMBER);
  fireEvent.press(getByText('clickme'));
  expect(mock).toBeCalledWith('+1' + PHONE_NUMBER);
});

test('should call redeemCode when button is clicked', async () => {
  const mock = jest.fn(() => Promise.resolve());
  const {getByText, getByTestId} = render(<AuthComponent
    signInWithPhone={() => {
      console.log("called func");
      return Promise.resolve()
    }}
    redeemCode={mock}
    verifyButtonMessage='clickme'
    enterCodeMessage='clickme1'
  />);
  fireEvent.changeText(getByTestId('phoneInput'), PHONE_NUMBER);
  fireEvent.press(getByText('clickme'));
  await waitForElement(() => getByTestId('codeButton'));
  fireEvent.changeText(getByTestId('codeInput'), '1234');
  fireEvent.press(getByText('clickme1'));
  expect(mock).toBeCalledWith('1234');
});
