import React from "react";
import "../styles/login.scss";

interface Props {
  password: string | null;
  start?: boolean;
}
interface State {
  lettersGuessed: number;
  randomSuffix: string;
}

export class PasswordBreaker extends React.Component<Props, State> {
  private randomInterval?: ReturnType<typeof setInterval>;

  constructor(props: Props) {
    super(props);
    this.state = { lettersGuessed: 0, randomSuffix: "" };
  }

  componentDidMount() {
    if (this.props.start) {
      this.startGuessing();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.start && this.props.start) {
      this.startGuessing();
    }
  }

  componentWillUnmount() {
    if (this.randomInterval) clearInterval(this.randomInterval);
  }

  private randomString(length: number): string {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async startGuessing() {
    const { password } = this.props;
    if (!password) return;
    let letters = 0;
    const speed = 500;
    // initialize and start random suffix updates
    this.setState({
      lettersGuessed: 0,
      randomSuffix: this.randomString(password.length),
    });
    this.randomInterval = setInterval(() => {
      const remaining = password.length - this.state.lettersGuessed;
      if (remaining > 0) {
        this.setState({ randomSuffix: this.randomString(remaining) });
      } else if (this.randomInterval) {
        clearInterval(this.randomInterval);
      }
    }, 200);

    while (letters < password.length) {
      await new Promise((res) => setTimeout(res, speed));
      letters++;
      this.setState({ lettersGuessed: letters });
    }
    if (this.randomInterval) clearInterval(this.randomInterval);
    this.setState({ randomSuffix: "" });
  }

  render() {
    const { password } = this.props;
    const { lettersGuessed, randomSuffix } = this.state;
    const display = password
      ? password.slice(0, lettersGuessed) + randomSuffix
      : null;

    return (
      <div className="password-breaker-container">
        <p>Password Breaker</p>
        <span className="password-breaker-display">
          {display?.split("").map((letter) => (
            <span>{letter}</span>
          ))}
        </span>
      </div>
    );
  }
}
