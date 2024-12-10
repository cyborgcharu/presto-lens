// src/components/prompter/ScriptView.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';

interface ScriptViewProps {
  content: string[];
  fontSize: number;
  scrollViewRef: React.RefObject<ScrollView>;
<<<<<<< Updated upstream
  onScroll: (event: any) => void;
=======
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  textColor?: string;
  backgroundColor?: string;
  lineHeight?: number;
  fontFamily?: string;
  mirror?: boolean;
>>>>>>> Stashed changes
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  content,
  fontSize,
  scrollViewRef,
  onScroll,
<<<<<<< Updated upstream
=======
  textColor = '#ffffff',
  backgroundColor = '#000000',
  lineHeight = 1.5,
  fontFamily = Platform.OS === 'ios' ? 'System' : 'sans-serif',
  mirror = false,
>>>>>>> Stashed changes
}) => {
  const { width } = Dimensions.get('window');
  
<<<<<<< Updated upstream
  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, { padding: width * 0.1 }]}
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      {content.map((paragraph, index) => (
        <Text 
          key={index} 
          style={[
            styles.text, 
            { fontSize },
            index > 0 && styles.paragraph
          ]}
        >
          {paragraph}
        </Text>
      ))}
    </ScrollView>
=======
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

  // Centered reading guide
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
>>>>>>> Stashed changes
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
  },
  text: {
    color: '#fff',
    lineHeight: 50,
    textAlign: 'center',
  },
  paragraph: {
    marginTop: 40,
  },
<<<<<<< Updated upstream
});
=======
  readingGuideLine: {
    width: '100%',
    height: 2,
    opacity: 0.3,
  }
});

export default ScriptView;
>>>>>>> Stashed changes
