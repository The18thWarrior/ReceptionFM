import env2 from "react-dotenv";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
export const env = {
  REACT_APP_WORKSMANAGER_ADDRESS : process.env.REACT_APP_WORKSMANAGER_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  REACT_APP_CHAIN_ID : process.env.REACT_APP_CHAIN_ID || "31337",
  REACT_APP_MULTICALL_ADDRESS : process.env.REACT_APP_MULTICALL_ADDRESS || "0xa40b14bd26aa8b469182ecff4f02781a08946d83"

}

export const routes = {
  "channel-list" : "/manage",
  "channel-create" : "/newChannel",
  "channel-detail" : "/channel/",
  "account-detail" : "/account"
};

export const basicSvg = {
  svgPartOne : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2250" viewBox="0 0 2250 2250" height="2250" version="1.0"> <style> @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i"); </style> <defs> <clipPath id="b"> <path d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="e"> <path d="M 0.5 0 L 2249.351562 0 L 2249.351562 2249 L 0.5 2249 Z M 0.5 0" /> </clipPath> <clipPath id="d"> <path d="M0 0H2250V2249H0z" /> </clipPath> <clipPath id="g"> <path d="M 567.492188 566.992188 L 1682.140625 566.992188 L 1682.140625 1681.640625 L 567.492188 1681.640625 Z M 567.492188 566.992188" /> </clipPath> <clipPath id="h"> <path d="M 1124.816406 1681.640625 C 817.761719 1681.640625 567.492188 1431.371094 567.492188 1124.316406 C 567.492188 817.261719 817.761719 566.992188 1124.816406 566.992188 C 1431.871094 566.992188 1682.140625 817.261719 1682.140625 1124.316406 C 1682.140625 1431.371094 1431.871094 1681.640625 1124.816406 1681.640625 Z M 1124.816406 672.148438 C 875.597656 672.148438 672.648438 875.097656 672.648438 1124.316406 C 672.648438 1373.535156 875.597656 1576.488281 1124.816406 1576.488281 C 1374.035156 1576.488281 1576.984375 1373.535156 1576.984375 1124.316406 C 1576.984375 875.097656 1374.035156 672.148438 1124.816406 672.148438 Z M 1124.816406 672.148438" /> </clipPath> <clipPath id="j"> <path d="M 1004.199219 841 L 1245.632812 841 L 1245.632812 1409 L 1004.199219 1409 Z M 1004.199219 841" /> </clipPath> <linearGradient x1=".173" gradientTransform="matrix(0 -4035.78953 2269.9908 0 -20.638 3607.925)" xmlns:xlink="http://www.w3.org/1999/xlink" y1=".173" x2=".947" gradientUnits="userSpaceOnUse" y2=".947" xlink:type="simple" xlink:actuate="onLoad" id="f" xlink:show="other"> <stop stop-color="#E0D8F1" offset="0" /> <stop stop-color="#5527B4" offset="1" /> </linearGradient> <linearGradient x1="0" gradientTransform="matrix(10.51557 0 0 10.51557 567.492 566.992)" xmlns:xlink="http://www.w3.org/1999/xlink" y1="53.005" x2="106" gradientUnits="userSpaceOnUse" y2="53.005" xlink:type="simple" xlink:actuate="onLoad" id="i" xlink:show="other"> <stop stop-color="#FF6DAF" offset="0" /> <stop stop-color="#4C1BB0" offset="1" /> </linearGradient>',
  svgPartTwo : ' <filter x="0%" y="0%" width="100%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:actuate="onLoad" height="100%" id="a" xlink:show="other"> <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" color-interpolation-filters="sRGB" /> </filter> <mask id="c"> <g filter="url(#a)"> <path fill-opacity=".6" d="M-225 -225H2475V2475H-225z" /> </g> </mask> </defs> <g clip-path="url(#b)"> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2256.496094 L 0.5 2256.496094 Z M 0.5 0" /> <path fill="#FFF" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <path fill="#4C1BB0" d="M 0.5 0 L 2249.5 0 L 2249.5 2249 L 0.5 2249 Z M 0.5 0" /> <g mask="url(#c)"> <g> <g clip-path="url(#d)"> <g clip-path="url(#e)"> <path fill="url(#f)" d="M 0.5 2249 L 2249.351562 2249 L 2249.351562 0 L 0.5 0 Z M 0.5 2249" /> </g> </g> </g> </g> </g> <g clip-path="url(#g)"> <g clip-path="url(#h)"> <path fill="url(#i)" d="M 567.492188 566.992188 L 567.492188 1681.640625 L 1682.140625 1681.640625 L 1682.140625 566.992188 Z M 567.492188 566.992188" /> </g> </g> <g clip-path="url(#j)"> <path fill="#FFF" d="M 1245.632812 1061.660156 L 1132.527344 1061.660156 L 1241.28125 841.566406 L 1117.304688 841.566406 L 1004.199219 1127.035156 L 1108.601562 1127.035156 L 1030.300781 1408.148438 Z M 1245.632812 1061.660156" /> </g> <text font-family="Open Sans" x="50%" y="90%" class="base" dominant-baseline="middle" text-anchor="middle" font-size="10em" stroke="white" fill="white"> <tspan>',
  svgPartThree : "{0}</tspan></text></svg>"
};

export const channelListColumns = [
  {
    field: 'name',
    headerName: 'Channel Name',
    flex:2,
    editable: false,
    sortable: true
  },
  {
    field: 'description',
    headerName: 'Channel Description',
    flex:3,
    editable: false,
    sortable: false
  },
  {
    field: 'parse_image',
    headerName: 'Channel Image',
    flex:2,
    editable: false,
    sortable: false,
    renderCell: (params)=>{
      return (
          <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
      )
    }
  },
  {
    field: 'manageButton',
    headerName: '',
    flex:1,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      let channelLink = '/manage/'+params.row.id;
      return <Button component={Link} to={channelLink} variant="outlined" color="primary" sx={{mx:"auto"}}>Manage</Button>
    }
  }
];

export const postListColumns = [
  {
    field: 'parse_image',
    headerName: 'Post Image',
    flex:3,
    editable: false,
    sortable: true,
    renderCell: (params)=>{
      return (
          <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
      )
    }
  },
  {
    field: 'name',
    headerName: 'Post Title',
    flex:3,
    editable: false,
    sortable: false
  },
  {
    field: 'manageButton',
    headerName: '',
    flex:1,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      let channelLink = '/manage/'+params.row.id;
      return <Button component={Link} to={channelLink} variant="outlined" color="primary" sx={{mx:"auto"}}>Manage</Button>
    }
  }
];

export const membershipListColumns = [
  {
    field: 'name',
    headerName: 'Membership Name',
    flex: 3,
    editable: false,
    sortable: true
  },
  {
    field: 'description',
    headerName: 'Membership Description',
    flex: 6,
    editable: false,
    sortable: false
  },
  {
    field: 'level',
    headerName: 'Membership Level',
    flex: 3,
    editable: false,
    sortable: false
  },
  {
    field: 'newRow',
    flex: 10,
    editable: false,
    sortable: false,
    renderHeader: (params) => (
      <strong style={{ marginLeft: 'auto'}}>
        <IconButton aria-label="addRecord" >
          <AddIcon />
        </IconButton>
      </strong>
    )
  } 
];

export const levels = ['bronze', 'silver', 'gold'];

export const baseImage = 'data:image/png;base64,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';

export const channelListColumnsFan = [
  {
    field: 'name',
    headerName: 'Channel Name',
    width: 150,
    editable: false,
    sortable: true
  },
  {
    field: 'description',
    headerName: 'Channel Description',
    width: 250,
    editable: false,
    sortable: false
  },
  {
    field: 'parse_image',
    headerName: 'Channel Image',
    width: 250,
    editable: false,
    sortable: false,
    renderCell: (params)=>{
      return (
          <img src={params.row.parse_image} alt='' style={{width: "-webkit-fill-available"}} />
      )
    }
  },
  {
    field: 'accessButton',
    headerName: '',
    width: 250,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      let channelLink = '/channels/'+params.row.id;
      return <Button component={Link} to={channelLink} variant="outlined" color="primary" sx={{mx:"auto"}}>Access</Button>
    }
  }
];
