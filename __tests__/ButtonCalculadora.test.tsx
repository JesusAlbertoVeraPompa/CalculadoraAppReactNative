import React from 'react';
import {it, expect, jest} from '@jest/globals';
import renderer from 'react-test-renderer';
import {Pressable} from 'react-native';
import {ButtonCalculadora} from '../src/components/ButtonCalculadora';

it('calls onPress when button is pressed', () => {
  const onPress = jest.fn();
  const component = renderer.create(
    <ButtonCalculadora label="7" onPress={onPress} />,
  );

  const pressable = component.root.findByType(Pressable);
  pressable.props.onPress();

  expect(onPress).toHaveBeenCalledTimes(1);
});
