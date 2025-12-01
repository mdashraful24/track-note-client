import { ThreeDot } from "react-loading-indicators";

const Loading = () => {
    return (
        <div className="flex min-h-screen justify-center items-center gap-2">
            <ThreeDot color="#161bd4" size="medium" text="" textColor="#1c29b5" />
        </div>
    );
};

export default Loading;
