import './Loader.pcss';

export function Loader () {
  return (
    <div className="loader-background">
      <div className="loader-inner">
        <div className="loader-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}
