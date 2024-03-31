import React from "react";

type Props = { children: React.ReactNode };

const Container = (props: Props) => {
  const { children } = props;
  return (
    <div className="w-full h-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Container;
