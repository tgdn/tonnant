import { render } from "@testing-library/react-native";

import { RecordButton } from "../RecordButton";

describe("<RecordButton />", () => {
  it(`renders correctly`, () => {
    const rendered = render(<RecordButton />);
    const tree = rendered.toJSON();
    // Unmount after test: https://github.com/testing-library/react-testing-library/issues/1216#issuecomment-1595684566
    rendered.unmount();

    expect(tree).toMatchSnapshot();
  });
});
