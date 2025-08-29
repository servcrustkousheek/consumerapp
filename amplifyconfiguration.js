import {USER_POOL_ID, CLIENT_ID} from './env-vars';

export const amplifyConfig = {
  aws_project_region: 'ap-south-1',
  aws_cognito_region: 'ap-south-1',
  aws_user_pools_id: USER_POOL_ID,
  aws_user_pools_web_client_id: CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: ['PHONE_NUMBER'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['PHONE_NUMBER'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['PHONE_NUMBER'],
};
