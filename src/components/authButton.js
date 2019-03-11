import React, { useState } from 'react';
import Modal from 'react-modal';

import { useAuth } from '../../services/firebase';

Modal.setAppElement('#___gatsby')

const LoginForm = props => {
	const { signIn } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const onSubmitForm = e => {
		e.preventDefault();
		signIn('email', {email, password}).then(e => e && setError(e.message));
	};

	return (
		<React.Fragment>
			<form onSubmit={onSubmitForm}>
				<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				<button type="submit">Log In/Sign Up with Email</button>
				{error && <span style={{color: `red`}}>{error}</span>}
			</form>
			<button type="button" onClick={() => signIn('google')}>Sign In with Google</button>
		</React.Fragment>
	);
}

function LoginButton(props) {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	return (
		<React.Fragment>
			<button {...props} type="button" onClick={() => setModalIsOpen(true)}>
				Sign Up/Log In
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel="Log In/Sign Up"
			>
				<div>Log In/Sign Up</div>
				<button onClick={() => setModalIsOpen(false)}>close</button>
				<LoginForm />
			</Modal>
		</React.Fragment>
	);
}

function LogoutButton(props) {
	const { signOut } = useAuth();
	return <button {...props} type="button" onClick={signOut}>Log Out</button>
}

export default function AuthButton(props) {
	const { isLoggedIn } = useAuth();
	const Button = isLoggedIn ? LogoutButton : LoginButton;
	return <Button {...props} />
}