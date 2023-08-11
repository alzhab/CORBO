import { IMockConfig } from './types'
import mocker from 'mocker-data-generator'
const mock = mocker()

const MOCK_CONFIG: IMockConfig[] = [
  {
    method: 'POST',
    data: { token: 'token' },
    api: '/login',
    status: 200,
  },
  {
    method: 'POST',
    data: { token: 'token' },
    api: '/register',
    status: 200,
  },
  {
    method: 'POST',
    data: true,
    api: '/change_password_by_link',
    status: 200,
  },
  {
    method: 'POST',
    data: true,
    api: '/send_recover_link',
    status: 200,
  },
]

export default MOCK_CONFIG
