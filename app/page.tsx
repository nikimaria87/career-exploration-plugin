import {getChatGPTUser,chatGPTSignInPath} from './chatgpt-auth';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();return <Dashboard signedIn={!!user} signInPath={chatGPTSignInPath('/')} />;}
