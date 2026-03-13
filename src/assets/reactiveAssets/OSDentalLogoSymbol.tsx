import * as React from 'react'

interface OSDentalLogoSymbolProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

const OSDentalLogoSymbol: React.FC<OSDentalLogoSymbolProps> = ({
  className = '',
  width = 26,
  height = 26,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect
      y={-0.0000534058}
      width={26}
      height={26}
      rx={4.4975}
      fill="#2727E6"
    />
    <path
      opacity={0.4}
      d="M12.0204 13.9244C12.6378 13.6446 13.3388 13.6446 13.9562 13.9244L18.6604 16.0567C19.0082 16.2143 19.0082 16.7288 18.6604 16.8864L13.9562 19.0186C13.3388 19.2985 12.6378 19.2985 12.0204 19.0186L7.31624 16.8864C6.96847 16.7288 6.96847 16.2143 7.31624 16.0567L12.0204 13.9244Z"
      fill="white"
    />
    <path
      opacity={0.7}
      d="M12.0204 10.4863C12.6378 10.2065 13.3388 10.2065 13.9562 10.4863L18.6604 12.6186C19.0082 12.7762 19.0082 13.2907 18.6604 13.4483L13.9562 15.5806C13.3388 15.8604 12.6378 15.8604 12.0204 15.5806L7.31624 13.4483C6.96847 13.2907 6.96847 12.7762 7.31624 12.6186L12.0204 10.4863Z"
      fill="white"
    />
    <path
      d="M12.0204 7.04828C12.6378 6.76844 13.3388 6.76844 13.9562 7.04828L18.6604 9.18053C19.0082 9.33816 19.0082 9.85261 18.6604 10.0102L13.9562 12.1425C13.3388 12.4223 12.6378 12.4223 12.0204 12.1425L7.31624 10.0102C6.96847 9.85261 6.96847 9.33816 7.31624 9.18053L12.0204 7.04828Z"
      fill="white"
    />
  </svg>
)

export default OSDentalLogoSymbol
