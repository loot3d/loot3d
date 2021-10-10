import cx from 'classnames';

function Loader({ className, ...nextProps }) {
  return (
    <div
      className={cx('loader', className)}
      {...nextProps}
    >
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
      <div className="loader-item" />
    </div>
  );
}

export default Loader;
