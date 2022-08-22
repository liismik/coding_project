import { render, screen } from '@testing-library/react';
import FormComponent from './Components/FormComponent/FormComponent';
import './matchMedia';
import { BrowserRouter as Router } from 'react-router-dom';

test('Login component appears', () => {
    render(
      <Router>
        <FormComponent
            title={"Login"}
            buttonText={"Log in"}
            forgotPWLink={false}
        />
      </Router>
    );
  const text = screen.getByText("Login");
  expect(text).toBeInTheDocument();
});




/*
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
*/
