import React from "react";
import vaildateTag from '../../util/validate'

const InputHastag = ({ setTags, tags }) => {

    const removeTags = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const addTags = (event) => {
        if (event.key === "Enter") {
            setTags([...tags, vaildateTag(event.target.value)]);
            event.target.value = "";
        }
    };

    return <div className="tags-input mt-3">
        <ul id="tags">
            {tags.map((tag, index) => (
                <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                    <span className='tag-close-icon'
                        onClick={() => removeTags(index)}
                    >
                        x
                    </span>
                </li>
            ))}
        </ul>
        <input
            type="text"
            placeholder="Press enter to add tags"
            onKeyUp={e => e.key === "Enter" ? addTags(e) : null} />
    </div>

}

export default InputHastag;