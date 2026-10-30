
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveCurrentUser } from "../utils/auth";
import SiteHeader from "../components/SiteHeader/SiteHeader";

const USERS_KEY = "medibook-users";

function Auth() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setError("შეიყვანე სწორი ელფოსტა.");
            return;
        }

        if (isRegister) {
            if (name.trim().length < 2) {
                setError("სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.");
                return;
            }

            if (!/^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
                setError("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, ერთ ციფრს და სპეციალურ სიმბოლოს.");
                return;
            }

            if (password !== confirmPassword) {
                setError("პაროლები ერთმანეთს არ ემთხვევა.");
                return;
            }

            if (users.some((user) => user.email === normalizedEmail)) {
                setError("ეს ელფოსტა უკვე რეგისტრირებულია.");
                return;
            }

            const newUser = {
                id: crypto.randomUUID(),
                name: name.trim(),
                email: normalizedEmail,
                password,
                role: "patient",
            };

            localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
            saveCurrentUser({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            });
            navigate("/");
            return;
        }

        const user = users.find(
            (item) =>
                item.email === normalizedEmail && item.password === password
        );

        if (!user) {
            setError("ელფოსტა ან პაროლი არასწორია.");
            return;
        }

        saveCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        navigate("/");
    }

    return (
        <div className="app">
            <SiteHeader />
            <main>
                <section className="doctors-section">
                    <h1>{isRegister ? "რეგისტრაცია" : "შესვლა"}</h1>

                    <form onSubmit={handleSubmit} className="appointment-form">
                        {isRegister && (
                            <label>
                                სახელი
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </label>
                        )}

                        <label>
                            ელფოსტა
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            პაროლი
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={isRegister ? 8 : undefined}
                                required
                            />
                        </label>

                        {isRegister && (
                            <label>
                                გაიმეორე პაროლი
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    minLength={8}
                                    required
                                />
                            </label>
                        )}

                        {error && <p role="alert">{error}</p>}

                        <button className="button" type="submit">
                            {isRegister ? "რეგისტრაცია" : "შესვლა"}
                        </button>
                    </form>

                    <button
                        type="button"
                        className="button button-outline"
                        style={{ marginTop: "24px" }}
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError("");
                        }}
                    >
                        {isRegister
                            ? "უკვე გაქვს ანგარიში? შესვლა"
                            : "არ გაქვს ანგარიში? რეგისტრაცია"}
                    </button>
                </section>
            </main>
        </div>
    );
}

export default Auth;
