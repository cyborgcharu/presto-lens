// src/components/prompter/ScriptView.tsx
import React, { useMemo } from 'react';
import { 
  ScrollView, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
  Platform
} from 'react-native';

interface ScriptViewProps {
  content: string[];
  fontSize: number;
  scrollViewRef: React.RefObject<ScrollView>;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  textColor?: string;
  backgroundColor?: string;
  lineHeight?: number;
  fontFamily?: string;
  mirror?: boolean;
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  content,
  fontSize,
  scrollViewRef,
  onScroll,
  textColor = '#ffffff',
  backgroundColor = '#000000',
  lineHeight = 1.5,
  fontFamily = Platform.OS === 'ios' ? 'System' : 'sans-serif',
  mirror = false,
}) => {
  const { width, height } = Dimensions.get('window');
  
  const verticalPadding = height * 0.5;
  const horizontalPadding = width * 0.15;
  
  const dynamicStyles = useMemo(() => ({
    container: {
      backgroundColor,
      transform: [{ scaleY: mirror ? -1 : 1 }],
    } as ViewStyle,
    text: {
      color: textColor,
      fontSize,
      lineHeight: fontSize * lineHeight,
      fontFamily,
      transform: [{ scaleY: mirror ? -1 : 1 }],
    } as TextStyle,
    scrollContent: {
      paddingHorizontal: horizontalPadding,
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      minHeight: height + (2 * verticalPadding),
    } as ViewStyle,
  }), [backgroundColor, textColor, fontSize, lineHeight, fontFamily, mirror, width, height]);

  const ReadingGuide = () => (
    <View style={styles.readingGuideContainer}>
      <View style={[styles.readingGuideLine, { backgroundColor: textColor }]} />
    </View>
  );

  const renderedContent = useMemo(() => (
    content.map((paragraph, index) => (
      <Text 
        key={index} 
        style={[
          dynamicStyles.text,
          styles.paragraph,
        ]}
        allowFontScaling={false}
      >
        {paragraph}
      </Text>
    ))
  ), [content, dynamicStyles.text]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={dynamicStyles.scrollContent}
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        removeClippedSubviews={true}
      >
        {renderedContent}
      </ScrollView>
      <ReadingGuide />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  paragraph: {
    textAlign: 'center',
    marginVertical: 12,
  },
  readingGuideContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  readingGuideLine: {
    width: '100%',
    height: 2,
    opacity: 0.3,
  }
});

export default ScriptView;
