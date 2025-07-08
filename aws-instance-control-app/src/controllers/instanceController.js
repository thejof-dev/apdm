class InstanceController {
    constructor(awsHelper) {
        this.awsHelper = awsHelper;
    }

    async startInstance(req, res) {
        try {
            const instanceId = req.params.id;
            const result = await this.awsHelper.startInstance(instanceId);
            res.status(200).json({ message: 'Instance started successfully', result });
        } catch (error) {
            res.status(500).json({ message: 'Error starting instance', error: error.message });
        }
    }

    async stopInstance(req, res) {
        try {
            const instanceId = req.params.id;
            const result = await this.awsHelper.stopInstance(instanceId);
            res.status(200).json({ message: 'Instance stopped successfully', result });
        } catch (error) {
            res.status(500).json({ message: 'Error stopping instance', error: error.message });
        }
    }

    async getInstanceStatus(req, res) {
        try {
            const instanceId = req.params.id;
            const status = await this.awsHelper.getInstanceStatus(instanceId);
            res.status(200).json({ instanceId, status });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving instance status', error: error.message });
        }
    }
}

module.exports = InstanceController;