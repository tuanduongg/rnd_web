const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  // like '/berry-material-react/react/default'
  basename: '/',
  defaultPath: '/',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 4,
  colorSelected: '#00000047',
  maxFileUpload: 30,
  baseUrlImage: import.meta.env.VITE_APP_API_URL_UPLOAD || 'http://10.0.4.20:5005/',
  arrRowperpages: [5,10, 25, 50]
};

export default config;
