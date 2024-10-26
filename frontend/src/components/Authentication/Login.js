import React, { useState } from 'react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { VStack } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

axios.defaults.baseURL = 'https://chat-burst.netlify.app/'; // Replace with your API base URL


const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();
    const { setUser } = ChatState();
    const handleClick = () => setShow(!show);

    const submitHandler = async () => { 
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const { data } = await axios.post("/api/user/login", {
                email,
                password
            }, config);
            

            toast({
                title: 'Login Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: error.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='blue'
                width='100%'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                style={{ marginTop: 10 }}
                onClick={() => {
                    setEmail('guest@example.com');
                    setPassword('123456');
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
}

export default Login;


// import React, { useState } from 'react';
// import { FormControl, FormLabel } from '@chakra-ui/form-control';
// import { VStack } from '@chakra-ui/layout';
// import { Button } from '@chakra-ui/button';
// import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
// import { useToast } from '@chakra-ui/react';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// const BASE_URL = 'http://localhost:3001';

// const Login = () => {
//     const [show, setShow] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);

//     const toast = useToast();
//     const history = useHistory();
//     const handleClick = () => setShow(!show);

//     const submitHandler = async () => {
//         setLoading(true);
//         if (!email || !password) {
//             toast({
//                 title: 'Please fill all the Fields',
//                 status: 'warning',
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom"
//             });
//             setLoading(false);
//             return;
//         }

//         try {
//             const config = {
//                 method: 'POST',
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     email,
//                     password
//                 })
//             };

//             const response = await fetch(`${BASE_URL}/api/user/login`, config);
//             const data = await response.json();

//             if (response.ok) {
//                 toast({
//                     title: 'Login Successful!',
//                     status: 'success',
//                     duration: 5000,
//                     isClosable: true,
//                     position: "bottom"
//                 });
//                 localStorage.setItem('userInfo', JSON.stringify(data));
//                 setLoading(false);
//                 history.push('/chats');
//             } else {
//                 toast({
//                     title: 'Error Occurred!',
//                     description: data.message,
//                     status: 'warning',
//                     duration: 5000,
//                     isClosable: true,
//                     position: "bottom"
//                 });
//                 setLoading(false);
//             }
//         } catch (error) {
//             console.log(error);
//             toast({
//                 title: 'Error Occurred!',
//                 description: 'Something went wrong',
//                 status: 'warning',
//                 duration: 5000,
//                 isClosable: true,
//                 position: "bottom"
//             });
//             setLoading(false);
//         }
//     };

//     return (
//         <VStack spacing='5px'>
//             <FormControl id='email' isRequired>
//                 <FormLabel>Email</FormLabel>
//                 <Input
//                     placeholder='Enter Your Email'
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//             </FormControl>

//             <FormControl id='password' isRequired>
//                 <FormLabel>Password</FormLabel>
//                 <InputGroup>
//                     <Input
//                         type={show ? "text" : "password"}
//                         placeholder='Enter Your Password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <InputRightElement width='4.5rem'>
//                         <Button h='1.75rem' size='sm' onClick={handleClick}>
//                             {show ? "Hide" : "Show"}
//                         </Button>
//                     </InputRightElement>
//                 </InputGroup>
//             </FormControl>

//             <Button
//                 colorScheme='blue'
//                 width='100%'
//                 style={{ marginTop: 15 }}
//                 onClick={submitHandler}
//                 isLoading={loading}
//             >
//                 Login
//             </Button>

//             <Button
//                 variant='solid'
//                 colorScheme='red'
//                 width='100%'
//                 style={{ marginTop: 10 }}
//                 onClick={() => {
//                     setEmail('guest@example.com');
//                     setPassword('123456');
//                 }}
//             >
//                 Get Guest User Credentials
//             </Button>
//         </VStack>
//     );
// }

// export default Login;
