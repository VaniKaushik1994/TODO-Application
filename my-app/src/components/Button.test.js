import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Button from './Button.js';

// import { render, screen } from '@testing-library/react';
// import App from './App';

// // test('renders learn react link', () => {
// //   render(<App />);
// //   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// // });

//We use Jest's describe function to group together related tests
describe('Button', () => {
    //Inside the describe block, we use Jest's it function to define an individual test case
    it('Renders with correct name', () => {
        const className = "btn";
        const dataTarget="my-data-target";
        const buttonLabel = "I am a Button";
        //We render the Button with a prop name set to 'I am a button'.
        render(<Button className={className} onClick={() => {console.log('I am clicked')}} id={'add_to_do'} dataTarget={dataTarget} buttonLabel={buttonLabel}/>);
        //We use screen.getByText from @testing-library/react to find an element with the text 'I am a button'
        const headingElement = screen.getByText('I am a Button');
        //We use Jest's expect function to assert that the heading element is present in the rendered component.
        expect(headingElement).toBeInTheDocument();
        console.log(screen);
    });
    it('calls on click prop button when button is clicked', () => {
        const mockOnClick = jest.fn();
    
        // Render the component with the mock onClick function
        render(<Button onClick={mockOnClick} buttonLabel={'Click me'} />);
        
        // Find the button element
        const button = screen.getByText('Click me');
        
        // Simulate a click event on the button
        fireEvent.click(button);
        
        // Assert that the onClick function was called
        expect(mockOnClick).toHaveBeenCalled();
    })
})