export enum FeedbackCategory {
    AFC_SERVICE = 'afc_service',
     AFC_SERVICE_ESCALATION =  'afc_service_escalation',
     VC_SERVICE =  'vc_service',
      VC_SERVICE_ESCALATION = 'vc_service_escalation',
       VC_CUSTOM_SERVICE = 'vc_custom_service',
        GENERIC = 'generic'
}

export const feedbackFormTitles = new Map([
    [FeedbackCategory.AFC_SERVICE, "Document Accessibility Service"],
     [FeedbackCategory.AFC_SERVICE_ESCALATION, "Escalation of Document Accessibility Service Requests"],
     [FeedbackCategory.VC_SERVICE, "Audio/Video Accessibility Service"],
      [FeedbackCategory.VC_SERVICE_ESCALATION, "Escalation of Audio/Video Accessibility Service Requests"],
       [FeedbackCategory.VC_CUSTOM_SERVICE, "Audio/Video Accessibility Service Using Custom Training Models"],
        [FeedbackCategory.GENERIC, ""]
]);