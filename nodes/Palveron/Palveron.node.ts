import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Palveron implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PALVERON',
		name: 'palveron',
		icon: 'file:palveron.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'AI Governance — verify prompts, lookup traces, check agent status',
		defaults: {
			name: 'PALVERON',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'palveronApi',
				required: true,
			},
		],
		properties: [
			// ── Operation ────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Verify',
						value: 'verify',
						description: 'Check a prompt against governance policies',
						action: 'Verify a prompt against governance policies',
					},
					{
						name: 'Trace Lookup',
						value: 'traceLookup',
						description: 'Get details of a specific trace by ID',
						action: 'Look up a trace by ID',
					},
					{
						name: 'List Traces',
						value: 'listTraces',
						description: 'List recent traces with optional filters',
						action: 'List recent traces',
					},
					{
						name: 'Agent Status',
						value: 'agentStatus',
						description: 'Get the status of a registered agent',
						action: 'Get agent status',
					},
					{
						name: 'Health Check',
						value: 'healthCheck',
						description: 'Check if the PALVERON gateway is healthy',
						action: 'Check gateway health',
					},
				],
				default: 'verify',
			},

			// ── Verify Fields ────────────────────────────────
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['verify'],
					},
				},
				description: 'The text to verify against governance policies',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['verify'],
					},
				},
				description: 'Optional JSON metadata attached to the trace (e.g. user_id, session)',
			},

			// ── Trace Lookup Fields ──────────────────────────
			{
				displayName: 'Trace ID',
				name: 'traceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['traceLookup'],
					},
				},
				description: 'The trace ID to look up',
			},

			// ── List Traces Fields ───────────────────────────
			{
				displayName: 'Decision Filter',
				name: 'decisionFilter',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Allowed', value: 'ALLOWED' },
					{ name: 'Blocked', value: 'BLOCKED' },
					{ name: 'Modified', value: 'MODIFIED' },
				],
				default: '',
				displayOptions: {
					show: {
						operation: ['listTraces'],
					},
				},
				description: 'Filter traces by governance decision',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 20,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						operation: ['listTraces'],
					},
				},
				description: 'Maximum number of traces to return',
			},

			// ── Agent Status Fields ──────────────────────────
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['agentStatus'],
					},
				},
				description: 'The agent ID to check',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('palveronApi');

		const baseUrl = (credentials.baseUrl as string || 'https://gateway.palveron.com').replace(/\/+$/, '');
		const apiKey = credentials.apiKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let response: object;

				switch (operation) {
					case 'verify': {
						const prompt = this.getNodeParameter('prompt', i) as string;
						const metadataRaw = this.getNodeParameter('metadata', i, '{}') as string;
						let metadata = {};
						try {
							metadata = JSON.parse(metadataRaw);
						} catch {
							// ignore invalid JSON — send empty metadata
						}

						response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v1/verify`,
							headers: {
								'Authorization': `Bearer ${apiKey}`,
								'Content-Type': 'application/json',
							},
							body: {
								prompt,
								metadata: {
									...metadata as object,
									source: 'n8n',
								},
							},
							json: true,
						});
						break;
					}

					case 'traceLookup': {
						const traceId = this.getNodeParameter('traceId', i) as string;
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/traces?id=${encodeURIComponent(traceId)}`,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							json: true,
						});
						break;
					}

					case 'listTraces': {
						const decision = this.getNodeParameter('decisionFilter', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 20) as number;
						let url = `${baseUrl}/api/v1/traces?limit=${limit}`;
						if (decision) url += `&decision=${decision}`;
						response = await this.helpers.httpRequest({
							method: 'GET',
							url,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							json: true,
						});
						break;
					}

					case 'agentStatus': {
						const agentId = this.getNodeParameter('agentId', i) as string;
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v1/agents`,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							json: true,
						});
						// Filter for the specific agent
						const agents = (response as { agents?: Array<{ id: string }> }).agents || [];
						const agent = agents.find((a: { id: string }) => a.id === agentId);
						response = agent || { error: 'Agent not found', agentId };
						break;
					}

					case 'healthCheck': {
						response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/health`,
							json: true,
						});
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

				returnData.push({ json: response as INodeExecutionData['json'] });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
							operation: this.getNodeParameter('operation', i),
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
