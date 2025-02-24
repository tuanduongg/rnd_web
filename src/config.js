const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  // like '/berry-material-react/react/default'
  basename: '/',
  defaultPath: '/',
  fontFamily: `'Inter', sans-serif`,
  borderRadius: 4,
  colorSelected: '#00000047',
  maxFileUpload: 30,
  baseUrlImage: import.meta.env.VITE_APP_API_URL_UPLOAD || 'http://hnseowonintech.io.vn:5005/',
  arrRowperpages: [5,10, 25, 50]
};

export default config;
