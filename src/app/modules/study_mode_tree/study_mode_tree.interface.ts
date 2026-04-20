export type T_ContentManagementAdmin = {
  subjectName: string;
  systems: {
    name: string;
    topics: {
      topicName: string;
      subTopics: string[],
    }[],
  }[],
  contentFor: "student" | "professional",
  profileType: string,
} 
