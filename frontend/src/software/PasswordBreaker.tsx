import React from "react";
import "../styles/login.scss";
import CancelIcon from "../components/CancelIcon";

interface Props {
  password: string | null;
  start?: boolean;
  onComplete?: () => void;
  soundEnabled?: boolean;
  onClose?: () => void;
  version?: number;
}
interface State {
  lettersGuessed: number;
  randomSuffix: string;
  lastGuessedIndex: number | null;
}

export class PasswordBreaker extends React.Component<Props, State> {
  private randomInterval?: ReturnType<typeof setInterval>;
  private beepAudio?: HTMLAudioElement;
  static defaultProps = {
    soundEnabled: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      lettersGuessed: 0,
      randomSuffix: "",
      lastGuessedIndex: null,
    };
    this.beepAudio =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/dreamy-beep.wav")
        : undefined;
    if (this.beepAudio) {
      this.beepAudio.volume = 0.4;
    }
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
    if (prevProps.soundEnabled && !this.props.soundEnabled && this.beepAudio) {
      this.beepAudio.pause();
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
    const { password, onComplete } = this.props;
    if (!password) return;
    let letters = 0;
    const isV2 = (this.props.version ?? 1) >= 2;
    const speed = isV2 ? 1000 : 2000;
    this.setState({
      lettersGuessed: 0,
      randomSuffix: this.randomString(password.length),
      lastGuessedIndex: null,
    });

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
    }, isV2 ? 100 : 200);

    while (letters < password.length) {
      await new Promise((res) => setTimeout(res, speed));
      letters++;
      this.setState({ lettersGuessed: letters, lastGuessedIndex: letters - 1 });
      if (this.beepAudio && this.props.soundEnabled) {
        this.beepAudio.currentTime = 0;
        this.beepAudio.play().catch(() => {
        });
      }
    }
    if (this.randomInterval) clearInterval(this.randomInterval);
    this.setState({ randomSuffix: "" });
    if (onComplete) {
      onComplete();
    }
  }

  render() {
    const { password } = this.props;
    const { lettersGuessed, randomSuffix, lastGuessedIndex } = this.state;

    const content = password
      ? [
        ...Array.from({ length: lettersGuessed }).map((_, i) => (
          <span
            key={`g${i}`}
            className={i === lastGuessedIndex ? "animate" : ""}
          >
            {password[i]}
          </span>
        )),
        ...randomSuffix
          .split("")
          .map((c, i) => <span key={`r${i}`}>{c}</span>),
      ]
      : null;

    return (
      <div className="password-breaker-container" style={{}}>
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            cursor: "pointer",
            pointerEvents: "auto",
          }}
          onClick={() => {
            this.props.onClose?.();
          }}
        >
          <CancelIcon />
        </div>
        <p>Password Cracker{(this.props.version ?? 1) >= 2 ? " v2" : ""}</p>
        <span className="password-breaker-display">
          {content && content.length > 0 ? content : "Select a target"}
        </span>
      </div>
    );
  }
}
