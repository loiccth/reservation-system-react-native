import React from 'react'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import { connectHighlight } from 'react-instantsearch-native'

const HighlightAdd = ({ attribute, hit, highlight, customStyle }) => {
    const highlights = highlight({
        highlightProperty: '_highlightResult',
        attribute,
        hit,
    })

    return (
        <Text>
            {highlights.map(({ value, isHighlighted }, index) => {
                const style = {
                    backgroundColor: isHighlighted ? 'yellow' : 'transparent',
                    ...customStyle
                }

                return (
                    <Text key={index} style={style}>
                        {value.split(', ')[0]}
                    </Text>
                )
            })}
        </Text>
    )
}

HighlightAdd.propTypes = {
    attribute: PropTypes.string.isRequired,
    hit: PropTypes.object.isRequired,
    highlight: PropTypes.func.isRequired,
    customStyle: PropTypes.object.isRequired
}

export default connectHighlight(HighlightAdd)