import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';

const adidasDark = '#1b1c1c';
const adidasBlue = '#1c53e6';

const Contact = () => {
    const form = useRef();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

    const onSubmit = (data) => {
        emailjs.sendForm(
            'ayopee01',
            'template_ychozgb',
            form.current,
            '28OMdSdVazafrHpK2'
        )
            .then(() => {
                setSnackbar({ open: true, message: "Email sent successfully!", severity: "success" });
                reset();
            }, () => {
                setSnackbar({ open: true, message: "Email sending error", severity: "error" });
            });
    };

    const handleCancel = () => reset();

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box
            id="Contact"
            sx={{
                bgcolor: adidasDark,
                minHeight: '100vh',
                py: 0,
                px: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // for footer at bottom
            }}
        >
            {/* Contact Form */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    pt: 6,
                    flex: 1, // so footer stays at bottom
                }}
            >
                <Paper elevation={8} sx={{
                    maxWidth: 460,
                    width: '100%',
                    borderRadius: 5,
                    p: 3,
                    boxShadow: '0 10px 48px rgba(0,0,0,0.12)',
                    background: adidasDark,
                }}>
                    <CardContent sx={{ p: 0 }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            align="center"
                            gutterBottom
                            sx={{
                                color: '#fff',
                                fontFamily: 'Montserrat, Roboto, sans-serif'
                            }}
                        >
                            Contact Me
                        </Typography>
                        <Typography
                            variant="body1"
                            align="center"
                            mb={3}
                            sx={{ color: '#fff' }}
                        >
                            Feel free to contact me directly at{" "}
                            <Box
                                component="a"
                                href="mailto:Ayopee001@Gmail.com"
                                sx={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: adidasBlue,
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Ayopee001@Gmail.com
                            </Box>{" "}
                            or through this form.
                        </Typography>
                        <form ref={form} id="contact" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Grid container spacing={2} direction="column">
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("firstname", {
                                            required: "First name is required",
                                            minLength: { value: 3, message: "First name must be at least 3 characters" }
                                        })}
                                        error={!!errors.firstname}
                                        helperText={errors.firstname?.message}
                                        FormHelperTextProps={{ style: { color: "#e57373" } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("lastname", {
                                            required: "Last name is required",
                                            minLength: { value: 3, message: "Last name must be at least 3 characters" }
                                        })}
                                        error={!!errors.lastname}
                                        helperText={errors.lastname?.message}
                                        FormHelperTextProps={{ style: { color: "#e57373" } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter a valid email address"
                                            }
                                        })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        FormHelperTextProps={{ style: { color: "#e57373" } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        type="tel"
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Phone number must be exactly 10 digits"
                                            }
                                        })}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message}
                                        FormHelperTextProps={{ style: { color: "#e57373" } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("subject")}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        multiline
                                        rows={3}
                                        size="small"
                                        variant="filled"
                                        InputLabelProps={{ style: { color: '#bdbdbd' } }}
                                        InputProps={{
                                            style: { color: '#fff', background: '#222', borderRadius: 8 },
                                        }}
                                        {...register("message", { required: "Message is required" })}
                                        error={!!errors.message}
                                        helperText={errors.message?.message}
                                        FormHelperTextProps={{ style: { color: "#e57373" } }}
                                    />
                                </Grid>
                                <Grid item xs={12}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 2,
                                        mt: 2
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#fff',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontFamily: 'Montserrat, Roboto, sans-serif',
                                            minWidth: 110,
                                            borderRadius: 8,
                                            '&:hover': {
                                                borderColor: adidasBlue,
                                                color: adidasBlue,
                                                background: 'rgba(28,83,230,0.08)'
                                            }
                                        }}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        sx={{
                                            background: adidasBlue,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontFamily: 'Montserrat, Roboto, sans-serif',
                                            minWidth: 110,
                                            borderRadius: 8,
                                            boxShadow: '0 3px 16px rgba(28,83,230,0.06)',
                                            '&:hover': {
                                                background: '#fff',
                                                color: adidasBlue
                                            }
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                        <Snackbar
                            open={snackbar.open}
                            autoHideDuration={3500}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                                {snackbar.message}
                            </Alert>
                        </Snackbar>
                    </CardContent>
                </Paper>
            </Box>

            {/* Footer */}
            <Box sx={{
                py: 3,
                textAlign: 'center',
                color: '#fff',
                letterSpacing: 1,
                fontSize: 15,
                opacity: 0.7,
                fontFamily: 'Montserrat, Roboto, sans-serif'
            }}>
                © {new Date().getFullYear()} All rights reserved by Pee ple.
            </Box>
        </Box>
    );
};

export default Contact;
