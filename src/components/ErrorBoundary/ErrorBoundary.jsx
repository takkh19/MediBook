
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error("MediBook UI Error:", error);
        console.error("Component Stack:", errorInfo.componentStack);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <main
                    role="alert"
                    style={{
                        maxWidth: "600px",
                        margin: "80px auto",
                        padding: "32px 24px",
                        textAlign: "center",
                        fontFamily: "inherit",
                    }}
                >
                    <div
                        aria-hidden="true"
                        style={{ fontSize: "48px", marginBottom: "16px" }}
                    >
                        ⚕️
                    </div>

                    <h1>გვერდის ჩატვირთვისას შეცდომა მოხდა</h1>

                    <p>
                        სამწუხაროდ, გვერდის ჩვენება ვერ მოხერხდა.
                        სცადეთ ხელახლა.
                    </p>

                    <button
                        type="button"
                        className="button"
                        onClick={this.handleRetry}
                    >
                        სცადეთ ხელახლა
                    </button>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
