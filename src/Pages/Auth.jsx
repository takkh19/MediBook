
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
    const [error, setError] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes("@") || password.length < 6) {
            setError("შეიყვანე სწორი ელფოსტა და მინიმუმ 6-სიმბოლოიანი პაროლი.");
            return;
        }

        if (isRegister) {
            if (!name.trim()) {
                setError("სახელი აუცილებელია.");
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
                                minLength={6}
                                required
                            />
                        </label>

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
