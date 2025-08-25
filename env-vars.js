const ENV = {
  PRESTAGING: {
    USER_POOL_ID: 'ap-south-1_kr2lKfpmo',
    CLIENT_ID: '35camvgigiq9h9v1767epf2lp1',
    URI: 'https://7bq42679v1.execute-api.ap-south-1.amazonaws.com/prestaging/oms',
    OMS_NOAUTH_URL:
      'https://7bq42679v1.execute-api.ap-south-1.amazonaws.com/prestaging/omsNoAuth',
    REWARD_URL:
      'https://709vsffbmd.execute-api.ap-south-1.amazonaws.com/prestaging/rewards',
  },
  STAGING: {
   USER_POOL_ID: 'ap-south-1_VqRRCN2aH',
    CLIENT_ID: '76hi2v5b9l0dpcvurcvjgikn5i',
    URI: 'https://1uxgot3dne.execute-api.ap-south-1.amazonaws.com/staging/oms',
    OMS_NOAUTH_URL:
      'https://1uxgot3dne.execute-api.ap-south-1.amazonaws.com/staging/omsNoAuth',
    REWARD_URL:
      'https://5se61s66wl.execute-api.ap-south-1.amazonaws.com/staging/rewards',
  },
  PREPROD: {
    USER_POOL_ID: 'ap-south-1_gpPeVEGGh',
    CLIENT_ID: '460albp2eqqht4rk0v0ug5a360',
    URI: 'https://pnyye12wsg.execute-api.ap-south-1.amazonaws.com/preprod/oms',
    OMS_NOAUTH_URL:
      'https://pnyye12wsg.execute-api.ap-south-1.amazonaws.com/preprod/omsNoAuth',
    REWARD_URL:
      'https://xcidgchjh6.execute-api.ap-south-1.amazonaws.com/preprod/rewards',
  },
  PRODUCTION: {
    USER_POOL_ID: 'ap-south-1_HvuNsyGdF',
    CLIENT_ID: '74tv449pvjooev7s00sdjd4csb',
    URI: 'https://rvvmnrgbpj.execute-api.ap-south-1.amazonaws.com/prod/oms',
    OMS_NOAUTH_URL:
      'https://rvvmnrgbpj.execute-api.ap-south-1.amazonaws.com/prod/omsNoAuth',
    REWARD_URL:
      'https://bac4bd08g5.execute-api.ap-south-1.amazonaws.com/prod/rewards',
  },
};

const CURRENT_ENV = 'PRODUCTION';

const currentEnv = ENV[CURRENT_ENV];

export const {USER_POOL_ID, CLIENT_ID, URI, OMS_NOAUTH_URL, REWARD_URL} =
  currentEnv;

export const getCurrentEnv = () => CURRENT_ENV;

export const getFullConfig = () => currentEnv;
