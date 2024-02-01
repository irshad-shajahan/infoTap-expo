import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate an array of stars with random properties
    const generateStars = () => {
      const newStars = Array.from({ length: 20 }, (_, index) => ({
        id: index,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        driftAnimation: new Animated.Value(Math.random() * 20 - 10), // Random initial horizontal drift value
        blinkAnimation: new Animated.Value(1),
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  useEffect(() => {
    // Create drifting and blinking effects for each star
    const animateStars = () => {
      stars.forEach((star) => {
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(star.driftAnimation, {
                toValue: Math.random() * 400 - 100, // Random drift value
                duration: 50000,
                easing: Easing.linear,
                useNativeDriver: false,
              }),
            ])
          ),
          Animated.loop(
            Animated.sequence([
              Animated.timing(star.blinkAnimation, {
                toValue: 0.6,
                duration: 1000,
                useNativeDriver: false,
              }),
              Animated.timing(star.blinkAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
              }),
            ])
          ),
        ]).start();
      });
    };

    animateStars();
  }, [stars]);

  return (
    <View style={styles.starsContainer}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              transform: [{ translateX: star.driftAnimation }],
              opacity: star.blinkAnimation,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 50,
  },
});

export default Stars;
