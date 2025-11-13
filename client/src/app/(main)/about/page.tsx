import React from "react";

const About = () => {
  return (
    <div className="py-10 xl:px-65 lg:px-50 md:px-5 px-4">
      <div className="flex flex-col gap-8 mb-20">
        <div>
          <h2 className="text-center text-3xl font-bold">About The Level Up</h2>
        </div>
        <div>
          <p className="font-medium text-md text-gray-800 dark:text-gray-300">
            The Odin Project is one of those What I wish I had when I was
            learning resources. Not everyone has access to a computer science
            education or the funds to attend an intensive coding school and
            neither of those is right for everyone anyway. This project is
            designed to fill in the gap for people who are trying to hack it on
            their own but still want a high quality education.
          </p>
        </div>
      </div>
      <h2 className="text-center text-2xl font-base mb-8">
        What Can You Expect With Level Up
      </h2>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="font-medium text-lg">
              A full roadmap to becoming a developer
            </h4>
          </div>
          <div>
            <p className="font-medium text-gray-600">
              Our free, comprehensive curriculum will equip you to be a full
              stack developer, no matter your current experience level.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="font-medium text-lg">Learn by doing</h4>
          </div>
          <div>
            <p className="font-medium text-gray-600">
              The most effective learning happens while building projects, so we
              have strategically placed them throughout our curriculum. These
              projects will make a strong portfolio for you to showcase on your
              resume.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="font-medium text-lg">Receive support from others</h4>
          </div>
          <div>
            <p className="font-medium text-gray-600">
              The maintainers of the curriculum run a Discord community, with
              the help of countless other volunteers, where you can receive help
              with anything in our curriculum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
