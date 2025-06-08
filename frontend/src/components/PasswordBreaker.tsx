import React from "react";
import "../styles/login.scss";

interface Props {
  password: string | null;
  start?: boolean;
}
interface State {
  lettersGuessed: number;
  randomSuffix: string;
  lastGuessedIndex: number | null;
}

export class PasswordBreaker extends React.Component<Props, State> {
  private randomInterval?: ReturnType<typeof setInterval>;

  constructor(props: Props) {
    super(props);
    this.state = { lettersGuessed: 0, randomSuffix: "", lastGuessedIndex: null };
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
    const speed = 2000;
    this.setState({ lettersGuessed: 0, randomSuffix: this.randomString(password.length), lastGuessedIndex: null });

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
      this.setState({ lettersGuessed: letters, lastGuessedIndex: letters - 1 });
    }
    if (this.randomInterval) clearInterval(this.randomInterval);
    this.setState({ randomSuffix: "" });
  }

  render() {
    const { password } = this.props;
    const { lettersGuessed, randomSuffix, lastGuessedIndex } = this.state;

    // build animated spans for revealed letters then random letters
    const content = password
      ? [
          // guessed letters
          ...Array.from({ length: lettersGuessed }).map((_, i) => (
            <span key={`g${i}`} className={i === lastGuessedIndex ? 'animate' : ''}>
              {password[i]}
            </span>
          )),
          // random suffix letters
          ...randomSuffix.split('').map((c, i) => <span key={`r${i}`}>{c}</span>)
        ]
      : null;

    return (
      <div className="password-breaker-container">
        <p>Password Breaker</p>
        <span className="password-breaker-display">
          {content && content.length > 0 ? content : "Select a target"}
        </span>
      </div>
    );
  }
}
