import React from "react";
import "../styles/login.scss";
import CancelIcon from "../components/CancelIcon";

interface Props {
  password: string | null;
  start?: boolean;
  onComplete?: () => void;
  soundEnabled?: boolean;
  onClose?: () => void;
}
interface State {
  lettersGuessed: number;
  randomSuffix: string;
  lastGuessedIndex: number | null;
  position: { x: number; y: number };
  dragging: boolean;
}

export class PasswordBreaker extends React.Component<Props, State> {
  private randomInterval?: ReturnType<typeof setInterval>;
  private beepAudio?: HTMLAudioElement;
  private isDragging = false;
  private offset = { dx: 0, dy: 0 };
  private justPicked = false;
  static defaultProps = {
    soundEnabled: true,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      lettersGuessed: 0,
      randomSuffix: "",
      lastGuessedIndex: null,
      position: {
        x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
        y: typeof window !== "undefined" ? window.innerHeight * 0.85 : 0,
      },
      dragging: false,
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
    window.addEventListener("mousemove", this.handleMove, true);
    window.addEventListener("click", this.handleClick, true);
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
    window.removeEventListener("mousemove", this.handleMove, true);
    window.removeEventListener("click", this.handleClick, true);
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
    const speed = 2000;
    this.setState({
      lettersGuessed: 0,
      randomSuffix: this.randomString(password.length),
      lastGuessedIndex: null,
    });

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
      if (this.beepAudio && this.props.soundEnabled) {
        // Restart the sound to ensure it plays on each guess
        this.beepAudio.currentTime = 0;
        this.beepAudio.play().catch(() => {
          /* ignore autoplay restrictions */
        });
      }
    }
    if (this.randomInterval) clearInterval(this.randomInterval);
    this.setState({ randomSuffix: "" });
    // Notify parent that guessing is complete
    if (onComplete) {
      onComplete();
    }
  }

  private handleMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    this.setState({
      position: {
        x: e.clientX - this.offset.dx,
        y: e.clientY - this.offset.dy,
      },
    });
  };

  private handleClick = (e: MouseEvent) => {
    if (!this.isDragging) return;
    if (this.justPicked) {
      this.justPicked = false;
      return;
    }
    this.isDragging = false;
    this.setState({
      dragging: false,
      position: {
        x: e.clientX - this.offset.dx,
        y: e.clientY - this.offset.dy,
      },
    });
  };

  private handlePickUp = (e: React.MouseEvent) => {
    if (this.isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    this.offset = {
      dx: e.clientX - centerX,
      dy: e.clientY - centerY,
    };
    this.isDragging = true;
    this.justPicked = true;
    this.setState({
      dragging: true,
      position: {
        x: e.clientX - this.offset.dx,
        y: e.clientY - this.offset.dy,
      },
    });
  };

  render() {
    const { password } = this.props;
    const {
      lettersGuessed,
      randomSuffix,
      lastGuessedIndex,
      position,
      dragging,
    } = this.state;

    // build animated spans for revealed letters then random letters
    const content = password
      ? [
          // guessed letters
          ...Array.from({ length: lettersGuessed }).map((_, i) => (
            <span
              key={`g${i}`}
              className={i === lastGuessedIndex ? "animate" : ""}
            >
              {password[i]}
            </span>
          )),
          // random suffix letters
          ...randomSuffix
            .split("")
            .map((c, i) => <span key={`r${i}`}>{c}</span>),
        ]
      : null;

    return (
      <div
        className="password-breaker-container"
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          transform: dragging
            ? "translate(-50%, -50%) scale(1.02)"
            : "translate(-50%, -50%)",
          minWidth: "30vw",
        }}
        onMouseDown={this.handlePickUp}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            this.props.onClose?.();
          }}
        >
          <CancelIcon />
        </div>
        <p>Password Cracker</p>
        <span className="password-breaker-display">
          {content && content.length > 0 ? content : "Select a target"}
        </span>
      </div>
    );
  }
}
