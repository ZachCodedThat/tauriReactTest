import { gql } from "@apollo/client";

export const ITEM_RESULTS = gql`
  query getAllItems($name: String!) {
    itemsByName(name: $name) {
      name
      normalizedName
      id
      imageLink
      avg24hPrice
    }
  }
`;

export const QUEST_RESULTS = gql`
  query getAllQuestItems {
    quests {
      title
      id
      turnin {
        name
      }
      objectives {
        number
        target
      }
    }
  }
`;
