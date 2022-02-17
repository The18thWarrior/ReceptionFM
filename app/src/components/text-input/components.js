import React, { Ref, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import {BLOCK_TYPE, ENTITY_TYPE } from "draftail";

export const exporterConfig = {
  blockToHTML: (block) => {
    if (block.type === BLOCK_TYPE.BLOCKQUOTE) {
      return <blockquote />
    }

    // Discard atomic blocks, as they get converted based on their entity.
    if (block.type === BLOCK_TYPE.ATOMIC) {
      return {
        start: "",
        end: "",
      }
    }

    return null
  },

  entityToHTML: (entity, originalText) => {
    if (entity.type === ENTITY_TYPE.LINK) {
      return <a href={entity.data.url}>{originalText}</a>
    }

    if (entity.type === ENTITY_TYPE.IMAGE) {
      return <img src={entity.data.src} alt={entity.data.alt} />
    }

    if (entity.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      return <hr />
    }

    return originalText
  },
};