import {StyleSheet} from 'react-native';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textLarge: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textMedium: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 12,
  },
  listcard: {
    flexDirection:'column',
    backgroundColor: '#e6ecf1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginStart: 10,
    marginEnd: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  submit: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#0066cc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  score:{
    backgroundColor: 'red',
    padding: 7,
    marginStart: 5,
    marginEnd: 5,
    color:'white',
    borderRadius: 8,
  },
  dialog: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Or any background color for the dialog
    padding: 20,
    margin: 20, // Add some margin around the dialog
    borderRadius: 10, // Optional: round the corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
});

export default GlobalStyles;
