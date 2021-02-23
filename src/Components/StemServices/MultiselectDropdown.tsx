import React, { useEffect, useState } from "react";
import { useCombobox, useMultipleSelection } from "downshift";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import "./style.scss";
const MultiSelectDropDown = (props: any) => {
  const [inputItems, setInputItems] = useState(props.items);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [prevValue, setPrevValue] = useState<string[]>([]);

  useEffect(() => {
    document
      .getElementsByClassName("multiselect-menu")[0]
      ?.removeAttribute("role");
  }, []);

  const handleRemoveItem = (selectedItem: string) => {
    removeSelectedItem(selectedItem);
    const newValues = prevValue.filter(data => {
      return data !== selectedItem;
    });
    props.onChange(newValues);
    setPrevValue(newValues);
  };

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<string>({
    initialSelectedItems: [],
  });

  const getFilteredItems = () =>
    inputItems.filter(
      (item: string) =>
        selectedItems.indexOf(item) < 0 &&
        item.toLowerCase().startsWith(String(inputValue?.toLowerCase()))
    );

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    selectedItem: null,
    items: getFilteredItems(),
    onSelectedItemChange: props.handleSelectedItemChange(selectedItems),
    initialInputValue: props.value,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        props.items.filter((item: string) =>
          item.toLowerCase().includes(inputValue!.toLowerCase())
        )
      );
      props.updateValue(inputValue);
      if (
        selectedItems.length !== prevValue.length &&
        !selectedItems.every(el => prevValue.includes(el))
      ) {
        props.onChange(selectedItems);
        setPrevValue(selectedItems);
      }
    },

    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          };
        default:
          return changes;
      }
    },

    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue);
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            setInputValue("");
            addSelectedItem(selectedItem);
          }
          break;
        default:
          break;
      }
    },
  });

  return (
    <div>
      {/* <label
        aria-hidden="true"
        className="sr-only"
        aria-label={`${props.label} Multiselect`}
        {...getLabelProps()}
      >
        {props.label}
      </label> */}
      <ul aria-live="polite" aria-label="Selected items">
        {selectedItems.map((selectedItem, index) => (
          <li
            className="selected-values"
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
            onClick={e => {
              e.stopPropagation();
              handleRemoveItem(selectedItem);
            }}
          >
            {selectedItem}
            <span
              className="remove-selected"
              aria-label={`remove ${selectedItem}`}
              role="button"
              onClick={e => {
                e.stopPropagation();
                handleRemoveItem(selectedItem);
              }}
            >
              &#10005;
            </span>
          </li>
        ))}
      </ul>
      <div className="downshift-div" {...getComboboxProps()}>
        <input
          className="downshift-input"
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
          name={props.name}
          id={props.id}
          placeholder="Select multiple"
          required={props.required}
        />
        <button
          className="downshift-toggle-button"
          aria-hidden="true"
          type="button"
          {...getToggleButtonProps()}
        >
          <ArrowDropDown />
        </button>
      </div>
      <ul
        className="multiselect-menu"
        role="none"
        aria-live="off"
        {...getMenuProps()}
      >
        {isOpen &&
          getFilteredItems().map((item: any, index: number) => (
            <li
              className="downshift-item"
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MultiSelectDropDown;
