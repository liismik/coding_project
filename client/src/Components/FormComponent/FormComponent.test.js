import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormComponent from './FormComponent';
import '../../matchMedia';
import { BrowserRouter as Router } from 'react-router-dom';

/*beforeEach(() => {
    render(
        <Router>
            <FormComponent
                title={"Login"}
                buttonText={"Log in"}
                forgotPWLink={false}
            />
        </Router>
    );
})*/

function setup() {
    render(
        <Router>
            <FormComponent
                title={"Login"}
                buttonText={"Log in"}
                forgotPWLink={false}
            />
        </Router>
    );
}

function getInputs () {
    const emailInput = screen.getByLabelText('email-input');
    const passwordInput = screen.getByLabelText('password-input');
    const submitButton = screen.getByRole('button', {name: 'Log in'})
    return { emailInput, passwordInput, submitButton };
}

describe(FormComponent, () => {
    test("Login page renders", () => {
        setup();
        const text = screen.getByText("Login");
        expect(text).toBeInTheDocument();
    });

    /*test('Log in with correct credentials and verified account', async () => {
        const result = render(
            <Router>
                <FormComponent
                    title={"Login"}
                    buttonText={"Log in"}
                    forgotPWLink={false}
                />
            </Router>
        );

        const {emailInput, passwordInput, submitButton} = getInputs();
        fireEvent.change(emailInput, {target: {value: 'codingprojecttestaccount@test.test'}});
        fireEvent.change(passwordInput, {target: {value: 'Testtest123'}});
        fireEvent.click(submitButton);
        const toast = await result.container.querySelector('#success-toast');

        await waitFor(() => {
            expect(toast).toBeVisible();
        });
    });*/
});
