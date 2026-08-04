export default function DocWrapper({ className, style, background, children, header }) {

    return (
        <div className={`${className} h-full p-4 flex flex-col items-center`}
            style={{ backgroundColor: background || 'var(--color-bg-base)', ...style }}>
            {header && <div className="headerDark">{header}</div>}
            {children}
        </div>
    )
}
