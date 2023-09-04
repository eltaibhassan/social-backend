import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MyActionButton } from '../controls';

const Popup = (props) => {
  const { title, children, openPopup, setOpenPopup } = props;
  return (
    <Dialog open={openPopup} maxWidth="md" className="dialogWrapper">
      <DialogTitle className="dialogTitle">
        <div style={{ display: 'flex', paddingBottom: 10 }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <MyActionButton
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </MyActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

// import React from 'react';
// import { Dialog, Box, Paper, DialogContent, DialogTitle, Typography } from '@mui/material';

// import CloseIcon from '@mui/icons-material/Close';
// import { m, AnimatePresence } from 'framer-motion';

// import { MyActionButton, MyDivider, MyLabel } from '../controls';
// import { varFade } from './fade';

// const Popup = (props) => {
//   const { title, children, openPopup, setOpenPopup, sx, variants } = props;
//   return (
//     <AnimatePresence>
//       <Dialog
//         fullWidth
//         maxWidth="md"
//         open={openPopup}
//         onClose={() => {
//           setOpenPopup(false);
//         }}
//         PaperComponent={(props) => (
//           <Box
//             component={m.div}
//             {...(variants ||
//               varFade({
//                 distance: 120,
//                 durationIn: 0.32,
//                 durationOut: 0.24,
//                 easeIn: 'easeInOut',
//               }).inUp)}
//             sx={{
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Box
//               onClick={() => {
//                 setOpenPopup(false);
//               }}
//               sx={{ width: '100%', height: '100%', position: 'fixed' }}
//             />
//             <Paper sx={sx} {...props}>
//               {props.children}
//             </Paper>
//           </Box>
//         )}
//         // {...other}
//       >
//         {children}
//       </Dialog>
//       {/* <Dialog open={openPopup} maxWidth="lg" className="dialogWrapper">
//         <DialogTitle className="dialogTitle">
//           <div style={{ display: 'flex' }}>
//             <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
//               {title}
//             </Typography>
//             <MyActionButton
//               onClick={() => {
//                 setOpenPopup(false);
//               }}
//             >
//               <CloseIcon />
//             </MyActionButton>
//           </div>
//         </DialogTitle>
//         <DialogContent dividers>{children}</DialogContent>
//       </Dialog> */}
//     </AnimatePresence>
//   );
// };

// export { Popup };

export { Popup };
